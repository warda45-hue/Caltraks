const SUPABASE_URL="REMPLACE_PAR_TON_URL_SUPABASE";
const SUPABASE_ANON_KEY="REMPLACE_PAR_TA_CLE_ANON_SUPABASE";
const configured=!SUPABASE_URL.startsWith("REMPLACE_")&&!SUPABASE_ANON_KEY.startsWith("REMPLACE_");
const sb=configured?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let mode="signup", selectedGoal=null, profile=null;

function screen(id){$$(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");location.hash=id}
function msg(t){$("#authMsg").textContent=t}
function showToast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
function provider(name){if(!sb){msg("Configure d'abord Supabase dans app.js pour activer l'inscription Google/Apple.");return}sb.auth.signInWithOAuth({provider:name,options:{redirectTo:location.origin+location.pathname}}).then(({error})=>{if(error)msg(error.message)})}
$("#startBtn").onclick=()=>{mode="signup";updateAuth();screen("auth")}
$("#loginBtn").onclick=()=>{mode="login";updateAuth();screen("auth")}
$("#backHome").onclick=()=>screen("home");
$("#googleBtn").onclick=()=>provider("google");
$("#appleBtn").onclick=()=>provider("apple");
$("#toggleAuth").onclick=()=>{mode=mode==="signup"?"login":"signup";updateAuth()};
function updateAuth(){const s=mode==="signup";$("#authTitle").textContent=s?"Créer ton compte":"Se connecter";$("#authSub").textContent=s?"Commence gratuitement.":"Retrouve ton compte CalTrack.";$("#signupFields").style.display=s?"block":"none";$("#emailBtn").textContent=s?"Créer mon compte":"Se connecter";$("#toggleAuth").textContent=s?"J'ai déjà un compte":"Créer un compte";$("#password").autocomplete=s?"new-password":"current-password";msg("")}

$("#emailBtn").onclick=async()=>{
 if(!sb){msg("Le système de compte n'est pas encore connecté. Ajoute tes clés Supabase dans app.js.");return}
 const email=$("#email").value.trim(),password=$("#password").value,name=$("#name").value.trim();
 if(!email||password.length<8||(mode==="signup"&&!name)){msg("Vérifie les champs.");return}
 if(mode==="signup"){
   const {data,error}=await sb.auth.signUp({email,password,options:{data:{name}}});
   if(error){msg(error.message);return}
   if(!data.session){msg("Compte créé. Vérifie ton email puis ouvre le lien reçu.");return}
   await afterAuth(data.user);
 }else{
   const {data,error}=await sb.auth.signInWithPassword({email,password});
   if(error){msg(error.message);return}
   await afterAuth(data.user);
 }
};

async function afterAuth(user){
 if(!sb)return;
 const {data,error}=await sb.from("profiles").select("*").eq("id",user.id).maybeSingle();
 if(error){console.error(error);msg("Impossible de charger le profil.");return}
 if(data){profile=data;renderApp(user,data)}else{screen("profile");$("#age").focus()}
}
async function saveProfile(){
 if(!sb){$("#profileMsg").textContent="Supabase n'est pas configuré.";return}
 const {data:{user}}=await sb.auth.getUser();if(!user)return;
 const age=Number($("#age").value),height=Number($("#height").value),weight=Number($("#weight").value);
 if(age<13||age>120||height<100||height>230||weight<25||weight>300||!selectedGoal){$("#profileMsg").textContent="Complète les informations et choisis un objectif.";return}
 const payload={id:user.id,name:user.user_metadata?.name||user.email?.split("@")[0],age,height_cm:height,weight_kg:weight,activity:$("#activity").value,goal:selectedGoal};
 const {data,error}=await sb.from("profiles").upsert(payload).select().single();
 if(error){$("#profileMsg").textContent=error.message;return}
 profile=data;renderApp(user,data)
}
$("#saveProfile").onclick=saveProfile;
$$(".goals button").forEach(b=>b.onclick=()=>{$$(".goals button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selectedGoal=b.dataset.goal;$("#minor").classList.toggle("hidden",Number($("#age").value)>=18) });
$("#age").oninput=()=>$("#minor").classList.toggle("hidden",Number($("#age").value)>=18);

function renderApp(user,p){
 $("#hello").textContent=p.name||user.email?.split("@")[0]||"toi";$("#pWeight").textContent=p.weight_kg+" kg";$("#pHeight").textContent=p.height_cm+" cm";
 const labels={lose:"Perdre du poids",maintain:"Maintenir",gain:"Prendre du poids",habits:"Mieux manger"};$("#pGoal").textContent=labels[p.goal]||p.goal;
 $("#goalKcal").textContent=p.age<18?"Adapté avec prudence":"À personnaliser";
 $("#kcal").textContent="0";$("#kbar").style.width="0%";screen("app")
}
$("#logout").onclick=async()=>{if(sb)await sb.auth.signOut();profile=null;screen("home");showToast("Déconnecté")};

async function init(){
 if(!sb)return;
 const {data:{session}}=await sb.auth.getSession();
 if(session)await afterAuth(session.user);
 sb.auth.onAuthStateChange(async(event,session)=>{if(event==="SIGNED_IN"&&session)await afterAuth(session.user)})
}
init();
