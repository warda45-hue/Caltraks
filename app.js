const API="https://world.openfoodfacts.org/api/v3/product/";
const state={goal:Number(localStorage.getItem("ct_goal")||2000),entries:JSON.parse(localStorage.getItem("ct_entries")||"[]")};
let selected=null,stream=null,searchTimer=null;

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
const today=()=>new Date().toISOString().slice(0,10);
const save=()=>{localStorage.setItem("ct_goal",state.goal);localStorage.setItem("ct_entries",JSON.stringify(state.entries))};
function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
function totals(){return state.entries.filter(x=>x.date===today()).reduce((a,x)=>({kcal:a.kcal+x.kcal,p:a.p+x.p,c:a.c+x.c,f:a.f+x.f}),{kcal:0,p:0,c:0,f:0})}
function render(){
 const t=totals();$("#date").textContent=new Intl.DateTimeFormat("fr-FR",{weekday:"long",day:"numeric",month:"long"}).format(new Date());
 $("#kcal").textContent=Math.round(t.kcal);$("#goal").textContent=`${state.goal} kcal`;$("#kcalBar").style.width=Math.min(100,t.kcal/state.goal*100)+"%";
 $("#p").textContent=Math.round(t.p)+" g";$("#c").textContent=Math.round(t.c)+" g";$("#f").textContent=Math.round(t.f)+" g";
 $("#pbar").style.width=Math.min(100,t.p/100*100)+"%";$("#cbar").style.width=Math.min(100,t.c/250*100)+"%";$("#fbar").style.width=Math.min(100,t.f/70*100)+"%";
 renderMeals("#meals");renderMeals("#journalMeals");renderStats()
}
function renderMeals(sel){
 const root=$(sel), arr=state.entries.filter(x=>x.date===today());
 if(!arr.length){root.innerHTML='<div class="card empty">Aucun aliment aujourd’hui. Recherche un produit pour commencer.</div>';return}
 const groups={};arr.forEach(x=>(groups[x.meal]??=[]).push(x));
 root.innerHTML=Object.entries(groups).map(([m,items])=>`<article class="meal"><h3>${m}</h3>${items.map(x=>`<div class="meal-row"><div><b>${esc(x.name)}</b><br><small>${Math.round(x.qty)} g · ${Math.round(x.kcal)} kcal · P ${Math.round(x.p)}g · G ${Math.round(x.c)}g · L ${Math.round(x.f)}g</small></div><button class="remove" onclick="removeEntry('${x.id}')">×</button></div>`).join("")}</article>`).join("")
}
function renderStats(){const days=new Set(state.entries.map(x=>x.date));$("#days").textContent=days.size;$("#count").textContent=state.entries.length;$("#statKcal").textContent=Math.round(totals().kcal)+" kcal"}
window.removeEntry=id=>{state.entries=state.entries.filter(x=>x.id!==id);save();render();toast("Aliment supprimé")};
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function nutrition(p){
 const n=p.nutriments||{};
 return {kcal:Number(n["energy-kcal_100g"]??n["energy-kcal"]??0),p:Number(n["proteins_100g"]??0),c:Number(n["carbohydrates_100g"]??0),f:Number(n["fat_100g"]??0)}
}
function productFrom(p){
 const n=nutrition(p);
 return {code:p.code,name:p.product_name_fr||p.product_name||"Produit sans nom",image:p.image_front_small_url||p.image_front_url||"",kcal:n.kcal,p:n.p,c:n.c,f:n.f,serving:p.serving_size||""}
}
function renderProducts(list,target){
 const root=$(target);
 if(!list.length){root.innerHTML='<div class="empty">Aucun produit trouvé.</div>';return}
 root.innerHTML=list.map(p=>{const x=productFrom(p);return `<div class="result"><img src="${x.image||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23f2f4f7%22/%3E%3C/svg%3E'}" alt=""><div class="result-main"><b>${esc(x.name)}</b><small>${x.kcal?Math.round(x.kcal)+" kcal":"Calories non renseignées"} / 100 g · P ${x.p||0}g · G ${x.c||0}g · L ${x.f||0}g</small></div><button onclick='openAdd(${JSON.stringify(x)})'>Ajouter</button></div>`}).join("")
}
async function searchProducts(q,target){
 const root=$(target);if(q.trim().length<2){root.innerHTML='<div class="empty">Tape au moins 2 caractères pour rechercher.</div>';return}
 root.innerHTML='<div class="empty">Recherche…</div>';
 try{
  const url=`https://world.openfoodfacts.org/api/v2/search?categories_tags=foods&search_terms=${encodeURIComponent(q)}&page_size=12&fields=code,product_name,product_name_fr,image_front_small_url,image_front_url,nutriments,serving_size`;
  const r=await fetch(url);const d=await r.json();renderProducts((d.products||[]).filter(p=>p.product_name||p.product_name_fr),target)
 }catch(e){root.innerHTML='<div class="empty">Impossible de contacter la base pour le moment. Vérifie ta connexion.</div>'}
}
function openAdd(x){selected=x;$("#dName").textContent=x.name;$("#dInfo").textContent=`${x.kcal?Math.round(x.kcal)+" kcal":"Calories inconnues"} / 100 g · P ${x.p||0} g · G ${x.c||0} g · L ${x.f||0} g`;$("#qty").value=100;$("#addDialog").showModal()}
$("#add").onclick=()=>{if(!selected)return;const q=Number($("#qty").value);if(!(q>0))return;const r=q/100;state.entries.push({id:crypto.randomUUID(),date:today(),name:selected.name,qty:q,kcal:(selected.kcal||0)*r,p:(selected.p||0)*r,c:(selected.c||0)*r,f:(selected.f||0)*r,meal:$("#meal").value,code:selected.code});save();$("#addDialog").close();render();toast("Produit ajouté ✓")};

$("#search").oninput=e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>searchProducts(e.target.value,"#results"),500)};
$("#foodSearch").oninput=e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>searchProducts(e.target.value,"#foodResults"),500)};

$("#clear").onclick=()=>{if(confirm("Effacer les aliments d’aujourd’hui ?")){state.entries=state.entries.filter(x=>x.date!==today());save();render()}};
$("#profileOpen").onclick=()=>{$("#goalInput").value=state.goal;$("#profileDialog").showModal()};
$("#saveGoal").onclick=()=>{const g=Number($("#goalInput").value);if(g>0){state.goal=g;save();$("#profileDialog").close();render();toast("Objectif enregistré ✓")}};

$$("[data-close]").forEach(x=>x.onclick=()=>x.closest("dialog").close());

async function lookupBarcode(code){
 code=code.replace(/\D/g,"");if(!code)return;
 $("#scanStatus").textContent="Recherche du produit…";
 try{
  const r=await fetch(`${API}${encodeURIComponent(code)}?product_type=all&fields=code,product_name,product_name_fr,image_front_small_url,image_front_url,nutriments,serving_size`);
  const d=await r.json();
  if(!d.product){$("#scanStatus").innerHTML='<span class="found" style="background:#fef2f2;color:#991b1b">Produit non trouvé. Vérifie le code ou essaie une autre référence.</span>';return}
  const x=productFrom(d.product);$("#scanStatus").innerHTML=`<div class="found"><b>${esc(x.name)}</b><br>${x.kcal?Math.round(x.kcal)+" kcal / 100 g":"Valeurs énergétiques non renseignées"}<button type="button" class="primary full" id="scanAdd">Ajouter au journal</button></div>`;$("#scanAdd").onclick=()=>{$("#scanDialog").close();stopCamera();openAdd(x)}
 }catch(e){$("#scanStatus").textContent="Erreur réseau. Réessaie."}
}
$("#lookup").onclick=()=>lookupBarcode($("#barcode").value);
$("#scanOpen").onclick=async()=>{ $("#scanStatus").textContent="";$("#barcode").value="";$("#scanDialog").showModal();startCamera() };
$("#scanDialog").addEventListener("close",stopCamera);

async function startCamera(){
 if(!("mediaDevices" in navigator)){return}
 try{
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});$("#video").srcObject=stream;await $("#video").play();
  if("BarcodeDetector" in window){
   const detector=new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e"]});
   const tick=async()=>{if(!stream)return;try{const codes=await detector.detect($("#video"));if(codes.length){$("#barcode").value=codes[0].rawValue;lookupBarcode(codes[0].rawValue);return}}catch{}requestAnimationFrame(tick)};tick()
  }else $("#scanStatus").textContent="Scan caméra non pris en charge par ce navigateur : entre le code ci-dessous."
 }catch(e){$("#scanStatus").textContent="Caméra indisponible. Autorise l’accès caméra ou entre le code manuellement."}
}
function stopCamera(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;$("#video").srcObject=null}}

window.addEventListener("hashchange",()=>{const id=location.hash.slice(1)||"home";$$(".page").forEach(x=>x.style.display=x.id===id?"block":"none")});
render();window.dispatchEvent(new HashChangeEvent("hashchange"));
