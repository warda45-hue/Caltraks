const foods=[
{id:1,name:"Banane",unit:"100 g",kcal:89,p:1.1,c:22.8,f:0.3,barcodes:["000000000001"]},
{id:2,name:"Pomme",unit:"100 g",kcal:52,p:.3,c:13.8,f:.2,barcodes:["000000000002"]},
{id:3,name:"Riz blanc cuit",unit:"100 g",kcal:130,p:2.7,c:28.2,f:.3,barcodes:["000000000003"]},
{id:4,name:"Poulet rôti",unit:"100 g",kcal:239,p:27.3,c:0,f:13.6,barcodes:["000000000004"]},
{id:5,name:"Œuf",unit:"100 g",kcal:143,p:12.6,c:.7,f:9.5,barcodes:["000000000005"]},
{id:6,name:"Pâtes cuites",unit:"100 g",kcal:157,p:5.8,c:30.9,f:.9,barcodes:["000000000006"]},
{id:7,name:"Yaourt nature",unit:"100 g",kcal:61,p:3.5,c:4.7,f:3.3,barcodes:["000000000007"]},
{id:8,name:"Flocons d'avoine",unit:"100 g",kcal:389,p:16.9,c:66.3,f:6.9,barcodes:["000000000008"]},
{id:9,name:"Avocat",unit:"100 g",kcal:160,p:2,c:8.5,f:14.7,barcodes:["000000000009"]},
{id:10,name:"Pain complet",unit:"100 g",kcal:247,p:13,c:41.4,f:4.2,barcodes:["000000000010"]},
{id:11,name:"Lait demi-écrémé",unit:"100 g",kcal:46,p:3.3,c:4.8,f:1.6,barcodes:["000000000011"]},
{id:12,name:"Amandes",unit:"100 g",kcal:579,p:21.2,c:21.6,f:49.9,barcodes:["000000000012"]}
];

const state={
 goal:Number(localStorage.getItem("caltrack_goal")||2000),
 entries:JSON.parse(localStorage.getItem("caltrack_entries")||"[]")
};

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function save(){localStorage.setItem("caltrack_entries",JSON.stringify(state.entries));localStorage.setItem("caltrack_goal",state.goal)}
function today(){return new Date().toISOString().slice(0,10)}
function formatDate(){return new Intl.DateTimeFormat("fr-FR",{weekday:"long",day:"numeric",month:"long"}).format(new Date())}
function calcTotals(){
 return state.entries.filter(e=>e.date===today()).reduce((a,e)=>{a.kcal+=e.kcal;a.p+=e.p;a.c+=e.c;a.f+=e.f;return a},{kcal:0,p:0,c:0,f:0})
}
function renderDashboard(){
 const t=calcTotals();
 $("#todayLabel").textContent=formatDate();
 $("#totalCalories").textContent=Math.round(t.kcal);
 $("#goalLabel").textContent=`${state.goal} kcal`;
 $("#calorieProgress").style.width=Math.min(100,t.kcal/state.goal*100)+"%";
 $("#proteinTotal").textContent=Math.round(t.p)+" g";
 $("#carbTotal").textContent=Math.round(t.c)+" g";
 $("#fatTotal").textContent=Math.round(t.f)+" g";
 $("#proteinBar").style.width=Math.min(100,t.p/100*100)+"%";
 $("#carbBar").style.width=Math.min(100,t.c/250*100)+"%";
 $("#fatBar").style.width=Math.min(100,t.f/70*100)+"%";
 renderMeals("#todayMeals");
 renderStats();
}
function renderMeals(target){
 const root=$(target); const current=state.entries.filter(e=>e.date===today());
 if(!current.length){root.innerHTML=`<div class="card muted">Aucun aliment ajouté aujourd'hui. Commence par rechercher un aliment ci-dessus.</div>`;return}
 const groups={}; current.forEach(e=>(groups[e.meal]??=[]).push(e));
 root.innerHTML=Object.entries(groups).map(([meal,items])=>`
 <div class="meal-group"><h3>${meal}</h3>${items.map(e=>`
 <div class="meal-row"><div><strong>${e.name}</strong><br><small>${Math.round(e.qty)} g · ${Math.round(e.kcal)} kcal · P ${Math.round(e.p)}g · G ${Math.round(e.c)}g · L ${Math.round(e.f)}g</small></div>
 <button class="delete" onclick="removeEntry('${e.id}')">Supprimer</button></div>`).join("")}</div>`).join("");
}
function renderFoods(query=""){
 const q=query.trim().toLowerCase();
 const list=foods.filter(f=>!q||f.name.toLowerCase().includes(q)).slice(0,50);
 $("#foodResults").innerHTML=list.map(f=>`
 <article class="food-card"><h3>${f.name}</h3><p>Pour 100 g</p><div class="kcal">${f.kcal} kcal</div><p>P ${f.p}g · G ${f.c}g · L ${f.f}g</p><button class="primary" onclick="openFood(${f.id})">Ajouter</button></article>`).join("")||`<div class="card">Aucun aliment trouvé.</div>`;
}
function renderQuick(query=""){
 const q=query.trim().toLowerCase();
 if(!q){$("#quickResults").innerHTML="";return}
 const list=foods.filter(f=>f.name.toLowerCase().includes(q)).slice(0,5);
 $("#quickResults").innerHTML=list.map(f=>`<div class="quick-item"><span><strong>${f.name}</strong><br><small>${f.kcal} kcal / 100 g</small></span><button onclick="openFood(${f.id})">Ajouter</button></div>`).join("")||`<div class="muted" style="padding:12px">Aucun résultat.</div>`;
}
window.openFood=id=>{
 const f=foods.find(x=>x.id===id); if(!f)return;
 $("#dialogFoodName").textContent=f.name;
 $("#dialogFoodInfo").textContent=`${f.kcal} kcal · P ${f.p} g · G ${f.c} g · L ${f.f} g pour 100 g`;
 $("#quantity").value=100;
 $("#foodDialog").dataset.foodId=id;
 $("#foodDialog").showModal();
};
$("#confirmAdd").addEventListener("click",e=>{
 e.preventDefault();
 const f=foods.find(x=>x.id===$("#foodDialog").dataset.foodId); const qty=Number($("#quantity").value); if(!f||qty<=0)return;
 const ratio=qty/100;
 state.entries.push({id:crypto.randomUUID(),date:today(),name:f.name,qty,kcal:f.kcal*ratio,p:f.p*ratio,c:f.c*ratio,f:f.f*ratio,meal:$("#mealSelect").value});
 save();$("#foodDialog").close();renderDashboard();toast("Aliment ajouté au journal ✓");
});
window.removeEntry=id=>{state.entries=state.entries.filter(e=>e.id!==id);save();renderDashboard();toast("Aliment supprimé")};
$("#clearDay").addEventListener("click",()=>{if(confirm("Effacer tous les aliments d'aujourd'hui ?")){state.entries=state.entries.filter(e=>e.date!==today());save();renderDashboard();}});
$("#quickSearch").addEventListener("input",e=>renderQuick(e.target.value));
$("#foodSearch").addEventListener("input",e=>renderFoods(e.target.value));

$$("[data-view]").forEach(btn=>btn.addEventListener("click",()=>{
 const view=btn.dataset.view; $$(".view").forEach(v=>v.classList.remove("active")); $("#"+view).classList.add("active");
 $$(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
 if(view==="foods")renderFoods($("#foodSearch").value);
 if(view==="journal")renderMeals("#journalList");
 if(view==="stats")renderStats();
 window.scrollTo({top:0,behavior:"smooth"});
}));

$("#profileBtn").addEventListener("click",()=>{$("#goalInput").value=state.goal;$("#profileDialog").showModal()});
$("#saveGoal").addEventListener("click",e=>{e.preventDefault();const g=Number($("#goalInput").value);if(g>0){state.goal=g;save();$("#profileDialog").close();renderDashboard();toast("Objectif enregistré ✓")}});
$("#barcodeBtn").addEventListener("click",()=>{$("#barcodeInput").value="";$("#barcodeResult").innerHTML="";$("#barcodeDialog").showModal()});
$("#lookupBarcode").addEventListener("click",e=>{
 e.preventDefault();const code=$("#barcodeInput").value.trim();const f=foods.find(x=>x.barcodes.includes(code));
 $("#barcodeResult").innerHTML=f?`<div class="success"><strong>${f.name}</strong><br>${f.kcal} kcal / 100 g<br><button class="primary full" onclick="document.querySelector('#barcodeDialog').close();openFood(${f.id})">Ajouter</button></div>`:`<div class="error">Produit non trouvé dans la base de démonstration.</div>`;
});
function renderStats(){
 const days=new Set(state.entries.map(e=>e.date));
 $("#daysTracked").textContent=days.size;
 $("#foodsTracked").textContent=state.entries.length;
 $("#statsCalories").textContent=Math.round(calcTotals().kcal)+" kcal";
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
renderFoods();renderDashboard();
