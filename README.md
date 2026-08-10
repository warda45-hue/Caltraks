# ⚡ Caltracks - Suivi de Nutrition & Calories

Caltracks est une application web mobile-first permettant de suivre ses apports caloriques, ses macronutriments (protéines, glucides, lipides) et son poids au quotidien.

## 🚀 Fonctionnalités

- **Recherche d'aliments** : Intégration directe avec l'API OpenFoodFacts pour récupérer les valeurs nutritionnelles des aliments en temps réel.
- **Tableau de bord** : Barres de progression visuelles pour les calories et les macronutriments.
- **Journal de repas** : Suivi détaillé du petit-déjeuner, déjeuner et dîner.
- **Suivi du poids** : Historique des pesées au fil du temps.
- **Profil utilisateur** : Personnalisation du pseudo, de l'objectif calorique et du poids initial.
- **Sauvegarde locale & Supabase** : Stockage des données locales et synchronisation en base de données.

## 🛠️ Technologies utilisées

- **HTML5 / CSS3** (Design sombre responsive style iOS)
- **JavaScript (ES6+)**
- **API OpenFoodFacts** (Recherche nutritionnelle)
- **Supabase** (Base de données backend)
- **FontAwesome** (Iconographie)

## 📦 Installation & Utilisation

1. Téléchargez ou clonez le dépôt.
2. Ouvrez simplement le fichier `index.html` dans n'importe quel navigateur web.
3. Aucune installation ni compilation complexe n'est requise.

## ⚙️ Configuration Supabase

Si vous souhaitez connecter votre propre base de données Supabase, ouvrez `index.html` et remplacez les variables suivantes dans la section `<script>` :

```javascript
const SUPABASE_URL = "VOTRE_URL_SUPABASE"; 
const SUPABASE_ANON_KEY = "VOTRE_CLE_ANON_SUPABASE";
