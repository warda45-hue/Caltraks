const foods = [
  {name:"Banane", kcal:89, p:1.1, c:22.8, f:0.3},
  {name:"Pain complet", kcal:247, p:13, c:41, f:4.2},
  {name:"Yaourt nature", kcal:61, p:3.5, c:4.7, f:3.3},
  {name:"Riz basmati cuit", kcal:130, p:2.7, c:28.2, f:0.3},
  {name:"Poulet grillé", kcal:165, p:31, c:0, f:3.6},
  {name:"Flocons d'avoine", kcal:379, p:13.2, c:67.7, f:6.5},
  {name:"Avocat", kcal:160, p:2, c:8.5, f:14.7},
  {name:"Pomme", kcal:52, p:0.3, c:13.8, f:0.2},
  {name:"Œuf", kcal:143, p:12.6, c:0.7, f:9.5},
  {name:"Pâtes cuites", kcal:158, p:5.8, c:30.9, f:0.9}
];

let state = JSON.parse(localStorage.getItem("caltrack") || "null") || {
  goal: 2000, water: 0, meals: []
};
let selectedFood = null;

const $ = id => document.getElementById(id);
$("today").textContent = new Intl.DateTimeFormat("fr-FR",{day:"numeric",month:"short",year:"numeric"}).format(new Date());

function save(){ localStorage.setItem("caltrack", JSON.stringify(state)); }
function totals(){
  return state.meals.reduce((a,m)=>({
    kcal:a.kcal+m.kcal,p:a.p+m.p,c:a.c+m.c,f:a.f+m.f
  }),{kcal:0,p:0,c:0,f:0});
}
function pct(v,max){ return Math.min(100, Math.round(v/max*100)); }

function render(){
  const t=totals(), goal=state.goal;
  $("calories").textContent=Math.round(t.kcal);
  $("calorieMacro").textContent=Math.round(t.kcal);
  $("goalValue").textContent=goal.toLocaleString("fr-FR");
  $("goalMacro").textContent=goal.toLocaleString("fr-FR");
  $("remaining").textContent=Math.max(0,Math.round(goal-t.kcal)).toLocaleString("fr-FR");
  const cp=pct(t.kcal,goal);
  $("calorieBar").style.width=cp+"%";
  $("calorieMini").style.width=cp+"%";
  $("calorieRing").style.background=`conic-gradient(#43c96b ${cp*3.6}deg,#e9edf1 0)`;
  $("protein").textContent=Math.round(t.p);
  $("carbs").textContent=Math.round(t.c);
  $("fat").textContent=Math.round(t.f);
  $("proteinMini").style.width=pct(t.p,120)+"%";
  $("carbMini").style.width=pct(t.c,250)+"%";
  $("fatMini").style.width=pct(t.f,65)+"%";
  const sum=t.p*4+t.c*4+t.f*9 || 1;
  const pp=Math.round(t.p*4/sum*100), cpct=Math.round(t.c*4/sum*100), fp=100-pp-cpct;
  $("pPct").textContent=pp+"%"; $("cPct").textContent=cpct+"%"; $("fPct").textContent=fp+"%";
  $("donut").style.background=`conic-gradient(#f28b9b 0 ${pp}%,#4ca7df ${pp}% ${pp+cpct}%,#f0b83b ${pp+cpct}% 100%)`;
  renderMeals(); renderWater();
}
function renderMeals(){
  const box=$("meals");
  if(!state.meals.length){box.innerHTML='<div class="empty">Aucun aliment ajouté aujourd’hui.<br>Utilise la recherche ci-dessus pour commencer.</div>';return}
  const groups={};
  state.meals.forEach((m,i)=>(groups[m.type]??=[]).push({...m,i}));
  const icons={"Petit-déjeuner":"🌅","Déjeuner":"☀️","Goûter":"☕","Dîner":"🌙"};
  box.innerHTML=Object.entries(groups).map(([type,arr])=>arr.map(m=>`
    <div class="meal">
      <div class="meal-icon">${icons[type]||"🍽️"}</div>
      <div class="meal-info"><strong>${m.name} <small>· ${m.grams} g</small></strong><small>${type} · ${Math.round(m.p)} g protéines · ${Math.round(m.c)} g glucides · ${Math.round(m.f)} g lipides</small></div>
      <div class="meal-kcal">${Math.round(m.kcal)} kcal</div>
      <button class="delete" onclick="removeMeal(${m.i})">×</button>
    </div>`).join("")).join("");
}
function renderWater(){
  $("waterText").innerHTML=`${state.water.toFixed(1).replace(".",",")} <small>/ 2 L</small>`;
  $("waterCups").innerHTML=Array.from({length:6},(_,i)=>`<button class="cup ${i<Math.round(state.water/.25)?"filled":""}" onclick="setWater(${i+1})"></button>`).join("");
}
function removeMeal(i){state.meals.splice(i,1);save();render();}
function setWater(n){state.water=Math.min(2,n*.25);save();render();}

$("foodSearch").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase(), box=$("searchResults");
  if(!q){box.classList.add("hidden");return}
  const results=foods.filter(f=>f.name.toLowerCase().includes(q)).slice(0,6);
  box.innerHTML=results.length?results.map((f,i)=>`<div class="result" onclick="openFood(${foods.indexOf(f)})"><span><b>${f.name}</b><small> / 100 g</small></span><b>${f.kcal} kcal</b></div>`).join(""):`<div class="result">Aucun aliment trouvé</div>`;
  box.classList.remove("hidden");
});
function openFood(i){
  selectedFood=foods[i];
  $("selectedFood").innerHTML=`<b>${selectedFood.name}</b> · ${selectedFood.kcal} kcal / 100 g`;
  $("grams").value=100; $("modal").classList.remove("hidden"); $("searchResults").classList.add("hidden"); $("foodSearch").value="";
}
$("closeModal").onclick=()=>$("modal").classList.add("hidden");
$("confirmAdd").onclick=()=>{
  const g=Math.max(1,Number($("grams").value)||100), f=selectedFood;
  state.meals.push({name:f.name,grams:g,type:$("mealType").value,kcal:f.kcal*g/100,p:f.p*g/100,c:f.c*g/100,f:f.f*g/100});
  save(); $("modal").classList.add("hidden"); render();
};
$("waterBtn").onclick=()=>setWater(Math.min(8,Math.round(state.water/.25)+1));
$("addMealBtn").onclick=()=>{ if(state.meals.length) openFood(foods.findIndex(f=>f.name==="Banane")); else openFood(0); };
$("editGoal").onclick=()=>{
  const v=prompt("Quel est ton objectif quotidien en kcal ?",state.goal);
  if(v && Number(v)>0){state.goal=Number(v);save();render();}
};
$("scanBtn").onclick=()=>alert("Le scanner code-barres sera ajouté dans une prochaine version.");
$("allMeals").onclick=()=>alert("La page Journal sera ajoutée dans la prochaine version.");
render();
