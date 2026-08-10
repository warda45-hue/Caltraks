# CalTrack V3

Version 3 de CalTrack, avec recherche de produits et lecture de codes-barres via l'API Open Food Facts.

## Fonctionnalités
- Recherche de produits réels via Open Food Facts
- Consultation des valeurs nutritionnelles disponibles
- Ajout par quantité en grammes
- Journal par repas
- Calories et macronutriments
- Objectif calorique
- Statistiques locales
- Lecture caméra via BarcodeDetector quand le navigateur le supporte
- Saisie manuelle du code-barres en secours
- Interface responsive

## Données nutritionnelles
Open Food Facts est une base collaborative. L'API précise que les données peuvent être incomplètes ou inexactes. Elles doivent donc être présentées comme des informations et non comme des données médicales garanties.

## API
Cette version utilise les endpoints publics de lecture Open Food Facts. La documentation actuelle recommande l'API v3 pour les nouvelles intégrations et indique les limites d'utilisation et les bonnes pratiques, notamment l'identification de l'application. Pour un service public à grande échelle, un backend et une stratégie de cache seront nécessaires.

## Limites de cette V3
GitHub Pages ne fournit pas de backend sécurisé, de base utilisateurs ou de paiement. Cette V3 est un vrai site front-end fonctionnel, mais les comptes, synchronisation cloud et abonnement Premium doivent être ajoutés avec un backend.

## Publication
Remplacer les trois fichiers `index.html`, `style.css`, `app.js` dans le dépôt GitHub Pages existant.
