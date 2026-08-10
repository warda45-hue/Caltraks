#   
  
<!DOCTYPE html>  
<html lang="fr">  
<head>  
  <meta charset="UTF-8">  
  <meta name="viewport" content="width=device-width, initial-scale=1.0">  
  <title>Nutrition - Journal & Open Food Facts</title>  
  <style>  
    /* --- VARIABLES & DESIGN SOMBRE V5 --- */  
    :root {  
      --bg-primary: #0f0f11;  
      --bg-secondary: #18181c;  
      --bg-tertiary: #24242a;  
      --border-color: #2e2e36;  
      --text-primary: #f0f0f3;  
      --text-secondary: #8e8e99;  
      --accent-green: #2ecc71;  
      --accent-blue: #3498db;  
      --accent-orange: #e67e22;  
    }  
  
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }  
    body { background-color: var(--bg-primary); color: var(--text-primary); padding-bottom: 2rem; }  
  
    /* --- AUTH MODAL --- */  
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; z-index: 1000; padding: 1rem; }  
    .modal { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 2rem; width: 100%; max-width: 400px; text-align: center; }  
    .modal h2 { margin-bottom: 0.5rem; }  
    .modal p { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; }  
    .modal input { width: 100%; padding: 0.8rem; margin-bottom: 1rem; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 6px; color: #fff; }  
      
    /* --- NAVBAR --- */  
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background-color: var(--bg-secondary); border-bottom: 1px solid var(--border-color); }  
    .logo { font-weight: 700; letter-spacing: 1px; font-size: 1.1rem; color: var(--text-primary); }  
    .user-badge { font-size: 0.85rem; color: var(--text-secondary); background: var(--bg-tertiary); padding: 0.4rem 0.8rem; border-radius: 20px; }  
  
    /* --- LAYOUT --- */  
    .container { max-width: 1000px; margin: 1.5rem auto; padding: 0 1rem; }  
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }  
  
    /* --- RECHERCHE OPEN FOOD FACTS --- */  
    .search-box { display: flex; gap: 10px; margin-bottom: 1rem; }  
    .search-box input { flex: 1; padding: 0.8rem 1rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 0.95rem; }  
    .search-box button, .btn { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.8rem 1.2rem; border-radius: 8px; cursor: pointer; font-weight: 500; }  
      
    .search-results { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; max-height: 250px; overflow-y: auto; margin-bottom: 1.5rem; display: none; }  
    .search-item { display: flex; justify-content: space-between; align-items: center; padding: 0.8rem 1rem; border-bottom: 1px solid var(--border-color); cursor: pointer; }  
    .search-item:hover { background: var(--bg-tertiary); }  
    .search-item-info small { color: var(--text-secondary); display: block; font-size: 0.8rem; }  
  
    /* --- REPAS --- */  
    .meal-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem 1.2rem; margin-bottom: 1rem; }  
    .meal-header { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-weight: 600; border-bottom: 1px solid var(--border-color); padding-bottom: 0.4rem; }  
    .food-list { list-style: none; }  
    .food-item { display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.9rem; border-bottom: 1px solid #222228; }  
    .food-item:last-child { border-bottom: none; }  
    .calories { color: var(--text-secondary); }  
  
    /* --- STATS & MACROS --- */  
    .card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 10px; padding: 1.2rem; }  
    .macro-bar { background: var(--bg-tertiary); height: 8px; border-radius: 4px; overflow: hidden; margin: 0.4rem 0 1rem 0; }  
    .macro-fill { height: 100%; width: 0%; transition: width 0.3s ease; }  
    .fill-prot { background: var(--accent-orange); }  
    .fill-carb { background: var(--accent-blue); }  
    .fill-fat { background: var(--accent-green); }  
    .macro-info { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); }  
  
    @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }  
  </style>  
</head>  
<body>  
  
  <!-- Connexion Utilisateur -->  
  <div class="modal-overlay" id="authModal">  
    <div class="modal">  
      <h2>Bienvenue</h2>  
      <p>Entrez vos informations pour personnaliser le suivi.</p>  
      <input type="text" id="usernameInput" placeholder="Votre prénom / pseudo">  
      <input type="number" id="calorieGoalInput" placeholder="Objectif quotidien (ex: 2000 kcal)">  
      <button class="btn" style="width: 100%;" onclick="saveUser()">Accéder au journal</button>  
    </div>  
  </div>  
  
  <!-- Barre de navigation -->  
  <header class="navbar">  
    <div class="logo">NUTRITION</div>  
    <div class="user-badge" id="userBadge">Déconnecté</div>  
  </header>  
  
  <!-- Contenu Principal -->  
  <main class="container">  
  
    <!-- Recherche d'aliments API Open Food Facts -->  
    <div class="search-box">  
      <input type="text" id="searchInput" placeholder="Rechercher un aliment réel (ex: Nutella, Pâtes, Poulet)...">  
      <button onclick="searchFood()">Rechercher</button>  
    </div>  
  
    <!-- Résultats de la recherche -->  
    <div class="search-results" id="searchResults"></div>  
  
    <!-- Disposition Grille FatSecret -->  
    <div class="dashboard-grid">  
  
      <!-- Colonne Gauche : Repas -->  
      <div>  
        <!-- Petit déjeuner -->  
        <div class="meal-card">  
          <div class="meal-header">  
            <span>Petit-déjeuner</span>  
            <span id="p-kcal">0 kcal</span>  
          </div>  
          <ul class="food-list" id="list-p"></ul>  
        </div>  
  
        <!-- Déjeuner -->  
        <div class="meal-card">  
          <div class="meal-header">  
            <span>Déjeuner</span>  
            <span id="d-kcal">0 kcal</span>  
          </div>  
          <ul class="food-list" id="list-d"></ul>  
        </div>  
  
        <!-- Dîner -->  
        <div class="meal-card">  
          <div class="meal-header">  
            <span>Dîner</span>  
            <span id="din-kcal">0 kcal</span>  
          </div>  
          <ul class="food-list" id="list-din"></ul>  
        </div>  
      </div>  
  
      <!-- Colonne Droite : Bilan Nutritionnel -->  
      <aside>  
        <div class="card">  
          <h3 style="margin-bottom: 1rem;">Macro-nutriments</h3>  
            
          <div class="macro-info"><span>Calories Totales</span><strong id="totalKcal">0 / 2000 kcal</strong></div>  
          <div class="macro-bar"><div class="macro-fill" id="fillKcal" style="background: var(--text-primary);"></div></div>  
  
          <div class="macro-info"><span>Protéines</span><span id="textProt">0g</span></div>  
          <div class="macro-bar"><div class="macro-fill fill-prot" id="fillProt"></div></div>  
  
          <div class="macro-info"><span>Glucides</span><span id="textCarb">0g</span></div>  
          <div class="macro-bar"><div class="macro-fill fill-carb" id="fillCarb"></div></div>  
  
          <div class="macro-info"><span>Lipides</span><span id="textFat">0g</span></div>  
          <div class="macro-bar"><div class="macro-fill fill-fat" id="fillFat"></div></div>  
        </div>  
      </aside>  
  
    </div>  
  </main>  
  
  <script>  
    let user = { name: "Invité", goal: 2000 };  
    let journal = { p: [], d: [], din: [] };  
  
    // Initialisation  
    window.onload = function() {  
      const savedUser = localStorage.getItem('nutri_user');  
      if (savedUser) {  
        user = JSON.parse(savedUser);  
        document.getElementById('authModal').style.display = 'none';  
        updateUI();  
      }  
    };  
  
    function saveUser() {  
      const name = document.getElementById('usernameInput').value || "Utilisateur";  
      const goal = parseInt(document.getElementById('calorieGoalInput').value) || 2000;  
      user = { name, goal };  
      localStorage.setItem('nutri_user', JSON.stringify(user));  
      document.getElementById('authModal').style.display = 'none';  
      updateUI();  
    }  
  
    // Connexion API Open Food Facts  
    async function searchFood() {  
      const query = document.getElementById('searchInput').value;  
      const resultsDiv = document.getElementById('searchResults');  
        
      if (!query) return;  
      resultsDiv.style.display = 'block';  
      resultsDiv.innerHTML = '<div style="padding:1rem;">Recherche en cours dans la base Open Food Facts...</div>';  
  
      try {  
        const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`);  
        const data = await res.json();  
          
        resultsDiv.innerHTML = '';  
        if (data.products.length === 0) {  
          resultsDiv.innerHTML = '<div style="padding:1rem;">Aucun produit trouvé.</div>';  
          return;  
        }  
  
        data.products.forEach(prod => {  
          const name = prod.product_name || "Produit inconnu";  
          const kcal = Math.round(prod.nutriments['energy-kcal_100g'] || 0);  
          const prot = Math.round(prod.nutriments['proteins_100g'] || 0);  
          const carb = Math.round(prod.nutriments['carbohydrates_100g'] || 0);  
          const fat = Math.round(prod.nutriments['fat_100g'] || 0);  
  
          const item = document.createElement('div');  
          item.className = 'search-item';  
          item.innerHTML = `  
            <div class="search-item-info">  
              <strong>${name}</strong>  
              <small>100g: ${kcal} kcal | P: ${prot}g G: ${carb}g L: ${fat}g</small>  
            </div>  
            <button class="btn" onclick="addFood('${name.replace(/'/g, "\\'")}', ${kcal}, ${prot}, ${carb}, ${fat})">+ Ajouter</button>  
          `;  
          resultsDiv.appendChild(item);  
        });  
      } catch (err) {  
        resultsDiv.innerHTML = '<div style="padding:1rem;">Erreur de connexion à la base de données.</div>';  
      }  
    }  
  
    function addFood(name, kcal, prot, carb, fat) {  
      // Ajoute par défaut au déjeuner  
      journal.d.push({ name, kcal, prot, carb, fat });  
      document.getElementById('searchResults').style.display = 'none';  
      document.getElementById('searchInput').value = '';  
      updateUI();  
    }  
  
    function updateUI() {  
      document.getElementById('userBadge').innerText = `${user.name} (${user.goal} kcal/j)`;  
  
      let totalKcal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;  
  
      // Mettre à jour les listes  
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
          li.innerHTML = `<span>${item.name}</span><span class="calories">${item.kcal} kcal</span>`;  
          listEl.appendChild(li);  
        });  
  
        document.getElementById(`${meal}-kcal`).innerText = `${mealKcal} kcal`;  
      });  
  
      // Mettre à jour le résumé  
      document.getElementById('totalKcal').innerText = `${totalKcal} / ${user.goal} kcal`;  
      document.getElementById('fillKcal').style.width = `${Math.min((totalKcal / user.goal) * 100, 100)}%`;  
  
      document.getElementById('textProt').innerText = `${totalProt}g`;  
      document.getElementById('fillProt').style.width = `${Math.min((totalProt / 150) * 100, 100)}%`;  
  
      document.getElementById('textCarb').innerText = `${totalCarb}g`;  
      document.getElementById('fillCarb').style.width = `${Math.min((totalCarb / 200) * 100, 100)}%`;  
  
      document.getElementById('textFat').innerText = `${totalFat}g`;  
      document.getElementById('fillFat').style.width = `${Math.min((totalFat / 70) * 100, 100)}%`;  
    }  
  </script>  
</body>  
</html>  
