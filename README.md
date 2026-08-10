# CalTrack V5 — vrais comptes

Cette V5 prépare un vrai système d'authentification avec **Supabase Auth** :
- email + mot de passe
- Google OAuth
- Apple OAuth
- profil utilisateur en base de données
- RLS pour que chaque utilisateur ne puisse lire/modifier que son profil
- parcours : Accueil → inscription/connexion → questionnaire → application

## IMPORTANT : GitHub Pages seul ne peut pas créer ces vrais comptes
Il faut créer un projet Supabase (gratuit pour commencer), puis renseigner :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

dans `app.js`.

La clé `anon` est destinée au client. **Ne mets jamais une clé `service_role` dans le code du site.**

## Configuration
1. Crée un projet Supabase.
2. Ouvre SQL Editor et exécute `supabase.sql`.
3. Dans Authentication > Providers, active Email.
4. Active Google et/ou Apple et configure leurs identifiants OAuth.
5. Dans Authentication > URL Configuration, ajoute l'URL de ton GitHub Pages dans les URLs autorisées.
6. Dans `app.js`, remplace les deux placeholders par l'URL et la clé publique de ton projet.
7. Remplace les fichiers de ton dépôt GitHub par `index.html`, `style.css` et `app.js`.
8. Garde `supabase.sql` et ce README comme documentation.

## Sécurité
Cette V5 ne stocke pas les mots de passe elle-même : Supabase Auth s'en charge.
Les données de profil sont protégées par Row Level Security.

Pour Apple/Google, la configuration des fournisseurs OAuth doit être faite dans leurs consoles respectives. Les boutons ne peuvent pas être réellement opérationnels sans ces identifiants.

## Mineurs
Le parcours collecte l'âge afin d'adapter le produit. Pour les moins de 18 ans, le front-end n'affiche pas automatiquement de déficit calorique. Une politique produit et de sécurité plus complète doit être définie avant un lancement public. 

const SUPABASE_URL = "https://abcdefghijklm.supabase.co"; // Votre adresse URL
const SUPABASE_ANON_KEY = "Sb_publishable_ThtHobuYQ7P-9c8AAb--dA_omDSiBEt";
