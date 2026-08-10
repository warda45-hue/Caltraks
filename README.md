<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Caltracks - Premium Nutrition</title>
  <!-- Supabase SDK -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    :root {
      --bg-main: #000000;
      --bg-card: #1c1c1e;
      --bg-input: #2c2c2e;
      --accent: #10b981;
      --accent-blue: #0a84ff;
      --accent-orange: #ff9f0a;
      --accent-red: #ff453a;
      --text-main: #ffffff;
      --text-sub: #8e8e93;
      --border: #38383a;
      --radius: 16px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
    body { background-color: var(--bg-main); color: var(--text-main); padding-bottom: 90px; }

    /* AUTH MODAL / SCREEN */
    .auth-overlay { position: fixed; inset: 0; background: var(--bg-main); z-index: 2000; display: flex; flex-direction: column; justify-content: center; padding: 2rem; }
    .auth-card { background: var(--bg-card); border-radius: var(--radius); padding: 2rem; border: 1px solid var(--border); text-align: center; }
    .auth-card h1 { font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--accent); }
    .auth-card p { color: var(--text-sub); margin-bottom: 1.5rem; font-size: 0.95rem; }
    .auth-card input { width: 100%; padding: 12px 16px; margin-bottom: 12px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 10px; color: #fff; font-size: 1rem; outline: none; }
    .auth-card button { width: 100%; padding: 14px; background: var(--accent); border: none; border-radius: 10px; color: #fff; font-weight: 600; font-size: 1rem; cursor: pointer; margin-top: 5px; }

    /* HEADER */
    header { padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); sticky: top; top: 0; z-index: 100; }
    .brand { font-weight: 800; font-size: 1.2rem; letter-spacing: 1px; color: var(--accent); }
    .user-pill { background: var(--bg-card); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; color: var(--text-sub); border: 1px solid var(--border); }

    /* PAGES CONTAINER */
    .page { display: none; padding: 1rem 1.5rem; animation: fadeIn 0.2s ease-in-out; }
    .page.active { display: block; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

    /* CARDS & UI ELEMENTS */
    .card { background: var(--bg-card); border-radius: var(--radius); padding: 1.2rem; border: 1px solid var(--border); margin-bottom: 1.2rem; }
    .card-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; }

    /* SEARCH BAR */
    .search-group { display: flex; gap: 8px; margin-bottom: 1rem; }
    .search-group input { flex: 1; padding: 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; color: #fff; font-size: 0.95rem; }
    .search-group button { padding: 12px 18px; background: var(--accent); border: none; border-radius: 12px; color: #fff; font-weight: 600; }

    .search-results { background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border); max-height: 250px; overflow-y: auto; margin-bottom: 1rem; display: none; }
    .search-item { padding: 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .search-item:last-child { border-bottom: none; }

    /* PROGRESS BARS */
    .macro-row { margin-bottom: 12px; }
    .macro-label { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-sub); margin-bottom: 4px; }
    .progress-bar { background: var(--bg-input); height: 8px; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }

    /* LISTS */
    .food-list { list-style: none; }
    .food-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--bg-input); font-size: 0.9rem; }
    .food-item:last-child { border-bottom: none; }

    /* NAVIGATION BAR (iPhone Style) */
    .navbar { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(28, 28, 30, 0.95); backdrop-filter: blur(20px); border-top: 1px solid var(--border); display: flex; justify-content: space-around; padding: 10px 0 25px 0; z-index: 1000; }
    .nav-item { display: flex; flex-direction: column; align-items: center; color: var(--text-sub); text-decoration: none; font-size: 0.75rem; gap: 4px; border: none; background: none; width: 25%; }
    .nav-item i { font-size: 1.2rem; }
    .nav-item.active { color: var(--accent); }

    /* WEIGHT CHART & FORM */
    .weight-entry { display: flex; gap: 10px; margin-bottom: 1rem; }
    .weight-entry input { flex: 1; padding: 10px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 10px; color: #fff; }
    .weight-entry button { padding: 10px 16px; background: var(--accent-blue); border: none; border-radius: 10px; color: #fff; font-weight: 600; }
  </style>
</head>
<body>

  <!-- ECRAN D'AUTHENTIFICATION -->
  <div class="auth-overlay" id="authScreen">
    <div class="auth-card">
      <h1>CALTRACKS</h1>
      <p>Connectez-vous pour enregistrer vos données</p>
      <input type="text" id="authName" placeholder="Prénom / Pseudo">
      <input type="number" id="authGoal" placeholder="Objectif calories (ex: 2000)">
      <input type="number" id="authWeight" placeholder="Poids actuel (kg)">
      <button onclick="handleAuth()">Se connecter / S'inscrire</button>
    </div>
  </div>

  <!-- HEADER -->
  <header>
    <div class="brand"><i class="fa-solid fa-bolt"></i> CALTRACKS</div>
    <div class="user-pill" id="userPill">Chargement...</div>
  </header>

  <!-- PAGE 1 : ACCUEIL & RECHERCHE -->
  <div class="page active" id="page-home">
    <div class="search-group">
      <input type="text" id="searchInput" placeholder="Rechercher un aliment...">
      <button onclick="searchFood()"><i class="fa-solid fa-magnifying-glass"></i></button>
    </div>

    <div class="search-results" id="searchResults"></div>

    <div class="card">
      <div class="card-title">
        <span>Aujourd'hui</span>
        <span id="kcalSummary" style="color: var(--accent);">0 / 2000 kcal</span>
      </div>
      <div class="macro-row">
        <div class="macro-label"><span>Calories</span><span id="labelKcal">0%</span></div>
        <div class="progress-bar"><div class="progress-fill" id="fillKcal" style="background: var(--text-main);"></div></div>
      </div>
      <div class="macro-row">
        <div class="macro-label"><span>Protéines</span><span id="labelProt">0g / 150g</span></div>
        <div class="progress-bar"><div class="progress-fill" id="fillProt" style="background: var(--accent-orange);"></div></div>
      </div>
      <div class="macro-row">
        <div class="macro-label"><span>Glucides</span><span id="labelCarb">0g / 200g</span></div>
        <div class="progress-bar"><div class="progress-fill" id="fillCarb" style="background: var(--accent-blue);"></div></div>
      </div>
      <div class="macro-row">
        <div class="macro-label"><span>Lipides</span><span id="labelFat">0g / 70g</span></div>
        <div class="progress-bar"><div class="progress-fill" id="fillFat" style="background: var(--accent);"></div></div>
      </div>
    </div>
  </div>

  <!-- PAGE 2 : JOURNAL DE REPAS -->
  <div class="page" id="page-journal">
    <div class="card">
      <div class="card-title"><span><i class="fa-solid fa-mug-saucer"></i> Petit-déjeuner</span><span id="p-kcal">0 kcal</span></div>
      <ul class="food-list" id="list-p"></ul>
    </div>
    <div class="card">
      <div class="card-title"><span><i class="fa-solid fa-utensils"></i> Déjeuner</span><span id="d-kcal">0 kcal</span></div>
      <ul class="food-list" id="list-d"></ul>
    </div>
    <div class="card">
      <div class="card-title"><span><i class="fa-solid fa-moon"></i> Dîner</span><span id="din-kcal">0 kcal</span></div>
      <ul class="food-list" id="list-din"></ul>
    </div>
  </div>

  <!-- PAGE 3 : SUIVI DU POIDS -->
  <div class="page" id="page-weight">
    <div class="card">
      <div class="card-title">Mettre à jour le poids</div>
      <div class="weight-entry">
        <input type="number" id="newWeightInput" placeholder="Poids en kg (ex: 72.5)" step="0.1">
        <button onclick="addWeight()"><i class="fa-solid fa-plus"></i></button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Historique de poids</div>
      <ul class="food-list" id="weightList"></ul>
    </div>
  </div>

  <!-- PAGE 4 : PROFIL & CONFIGURATION -->
  <div class="page" id="page-profile">
    <div class="card">
      <div class="card-title">Mon Profil</div>
      <div style="margin-bottom: 1rem; color: var(--text-sub);">
        <p style="margin-bottom: 5px;">Nom : <strong id="profileName" style="color: #fff;">-</strong></p>
        <p style="margin-bottom: 5px;">Objectif : <strong id="profileGoal" style="color: #fff;">- kcal</strong></p>
        <p>Poids actuel : <strong id="profileWeight" style="color: #fff;">- kg</strong></p>
      </div>
      <button onclick="logout()" style="width: 100%; padding: 12px; background: var(--accent-red); border: none; border-radius: 10px; color: #fff; font-weight: 600;">Se déconnecter</button>
    </div>
  </div>

  <!-- BARRE DE NAVIGATION (iOS Style) -->
  <nav class="navbar">
    <button class="nav-item active" onclick="switchPage('home', this)">
      <i class="fa-solid fa-house"></i><span>Accueil</span>
    </button>
    <button class="nav-item" onclick="switchPage('journal', this)">
      <i class="fa-solid fa-book-open"></i><span>Journal</span>
    </button>
    <button class="nav-item" onclick="switchPage('weight', this)">
      <i class="fa-solid fa-chart-line"></i><span>Poids</span>
    </button>
    <button class="nav-item" onclick="switchPage('profile', this)">
      <i class="fa-solid fa-user"></i><span>Profil</span>
    </button>
  </nav>

  <script>
    // --- SUPABASE CONFIGURATION ---
    const SUPABASE_URL = "https://your-project.supabase.co"; 
    const SUPABASE_ANON_KEY = "Sb_publishable_ThtHobuYQ7P-9c8AAb--dA_omDSiBEt";
    
    let supabaseClient = null;
    if (window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    let user = { name: "", goal: 2000, weight: 70 };
    let journal = { p: [], d: [], din: [] };
    let weightHistory = [];

    window.onload = function() {
      const savedUser = localStorage.getItem('caltracks_user');
      if (savedUser) {
        user = JSON.parse(savedUser);
        document.getElementById('authScreen').style.display = 'none';
        initApp();
      }
    };

    async function handleAuth() {
      const name = document.getElementById('authName').value || "Utilisateur";
      const goal = parseInt(document.getElementById('authGoal').value) || 2000;
      const weight = parseFloat(document.getElementById('authWeight').value) || 70;

      user = { name, goal, weight };
      localStorage.setItem('caltracks_user', JSON.stringify(user));

      if (supabaseClient) {
        try {
          await supabaseClient.from('users').insert([{ name: name, goal: goal }]);
        } catch (e) { console.error("Erreur Supabase:", e); }
      }

      document.getElementById('authScreen').style.display = 'none';
      initApp();
    }

    function logout() {
      localStorage.removeItem('caltracks_user');
      location.reload();
    }

    function initApp() {
      document.getElementById('userPill').innerText = `${user.name} • ${user.goal} kcal`;
      document.getElementById('profileName').innerText = user.name;
      document.getElementById('profileGoal').innerText = `${user.goal} kcal`;
      document.getElementById('profileWeight').innerText = `${user.weight} kg`;
      weightHistory.push({ date: 'Aujourd\'hui', weight: user.weight });
      renderWeight();
      updateUI();
    }

    function switchPage(pageId, btn) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.getElementById(`page-${pageId}`).classList.add('active');
      btn.classList.add('active');
    }

    async function searchFood() {
      const query = document.getElementById('searchInput').value;
      const resultsDiv = document.getElementById('searchResults');
      if (!query) return;

      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = '<div style="padding:12px; color:var(--text-sub);">Recherche...</div>';

      try {
        const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`, {
          headers: { 'User-Agent': 'CaltracksApp - Mobile - Version 2.0' }
        });
        const data = await res.json();
        
        resultsDiv.innerHTML = '';
        if (!data.products || data.products.length === 0) {
          resultsDiv.innerHTML = '<div style="padding:12px;">Aucun produit trouvé.</div>';
          return;
        }

        data.products.forEach(prod => {
          const name = prod.product_name || "Produit inconnu";
          const kcal = Math.round(prod.nutriments?.['energy-kcal_100g'] || 0);
          const prot = Math.round(prod.nutriments?.['proteins_100g'] || 0);
          const carb = Math.round(prod.nutriments?.['carbohydrates_100g'] || 0);
          const fat = Math.round(prod.nutriments?.['fat_100g'] || 0);

          const item = document.createElement('div');
          item.className = 'search-item';
          item.innerHTML = `
            <div>
              <strong>${name}</strong>
              <div style="font-size:0.75rem; color:var(--text-sub);">${kcal} kcal (100g) | P:${prot}g G:${carb}g L:${fat}g</div>
            </div>
            <button onclick="addFood('${name.replace(/'/g, "\\'")}', ${kcal}, ${prot}, ${carb}, ${fat})" style="padding:6px 12px; background:var(--accent); border:none; border-radius:8px; color:#fff; font-weight:600;">+ Ajouter</button>
          `;
          resultsDiv.appendChild(item);
        });
      } catch (err) {
        resultsDiv.innerHTML = '<div style="padding:12px;">Erreur de connexion.</div>';
      }
    }

    function addFood(name, kcal, prot, carb, fat) {
      journal.d.push({ name, kcal, prot, carb, fat });
      document.getElementById('searchResults').style.display = 'none';
      document.getElementById('searchInput').value = '';
      updateUI();
    }

    function addWeight() {
      const input = document.getElementById('newWeightInput');
      const val = parseFloat(input.value);
      if (val) {
        user.weight = val;
        weightHistory.unshift({ date: new Date().toLocaleDateString('fr-FR'), weight: val });
        document.getElementById('profileWeight').innerText = `${val} kg`;
        input.value = '';
        renderWeight();
      }
    }

    function renderWeight() {
      const list = document.getElementById('weightList');
      list.innerHTML = '';
      weightHistory.forEach(w => {
        const li = document.createElement('li');
        li.className = 'food-item';
        li.innerHTML = `<span>${w.date}</span><strong style="color:var(--accent-blue);">${w.weight} kg</strong>`;
        list.appendChild(li);
      });
    }

    function updateUI() {
      let totalKcal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;

      ['p', 'd', 'din'].forEach(meal => {
        const listEl = document.getElementById(`list-${meal}`);
        listEl.innerHTML = '';
        let mealKcal = 0;

        journal[meal].forEach(item => {
          mealKcal += item.kcal;
          totalKcal += item.kcal;
          totalProt += item.prot;
          totalCarb += item.carb;
          totalFat += item.fat;

          const li = document.createElement('li');
          li.className = 'food-item';
          li.innerHTML = `<span>${item.name}</span><span style="color:var(--text-sub);">${item.kcal} kcal</span>`;
          listEl.appendChild(li);
        });

        document.getElementById(`${meal}-kcal`).innerText = `${mealKcal} kcal`;
      });

      document.getElementById('kcalSummary').innerText = `${totalKcal} / ${user.goal} kcal`;
      const pct = Math.min((totalKcal / user.goal) * 100, 100);
      document.getElementById('labelKcal').innerText = `${Math.round(pct)}%`;
      document.getElementById('fillKcal').style.width = `${pct}%`;

      document.getElementById('labelProt').innerText = `${totalProt}g / 150g`;
      document.getElementById('fillProt').style.width = `${Math.min((totalProt / 150) * 100, 100)}%`;

      document.getElementById('labelCarb').innerText = `${totalCarb}g / 200g`;
      document.getElementById('fillCarb').style.width = `${Math.min((totalCarb / 200) * 100, 100)}%`;

      document.getElementById('labelFat').innerText = `${totalFat}g / 70g`;
      document.getElementById('fillFat').style.width = `${Math.min((totalFat / 70) * 100, 100)}%`;
    }
  </script>
</body>
</html>
