# 🚀 GUIDE COMPLET - Héberger ton tournoi sur GitHub avec Firebase

## 📋 Ce dont tu as besoin
1. Un compte GitHub (gratuit)
2. Un compte Firebase/Google (gratuit)
3. Tes 3 fichiers : index.html, style.css, app.js

---

## ÉTAPE 1 : Créer un projet Firebase (Base de données)

### 1.1 Aller sur Firebase
- Va sur https://console.firebase.google.com/
- Connecte-toi avec ton compte Google
- Clique sur "Ajouter un projet"

### 1.2 Créer le projet
- **Nom du projet** : `tournoi-jeux` (ou ce que tu veux)
- Désactive Google Analytics (pas nécessaire)
- Clique sur "Créer le projet"

### 1.3 Activer Realtime Database
1. Dans le menu à gauche, clique sur **"Realtime Database"**
2. Clique sur **"Créer une base de données"**
3. Choisis la région : **europe-west1** (Europe)
4. Mode de sécurité : Choisis **"Mode test"** (pour commencer)
5. Clique sur **"Activer"**

### 1.4 Récupérer la configuration
1. Clique sur l'icône **engrenage ⚙️** → **Paramètres du projet**
2. Scroll vers le bas → **Vos applications** → Clique sur **</>** (icône web)
3. Enregistre le nom : `tournoi-app`
4. **COPIE TOUTE LA CONFIGURATION** qui ressemble à ça :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tournoi-jeux.firebaseapp.com",
  databaseURL: "https://tournoi-jeux-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "tournoi-jeux",
  storageBucket: "tournoi-jeux.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

### 1.5 Configurer les règles de sécurité
1. Retourne dans **Realtime Database**
2. Clique sur l'onglet **"Règles"**
3. Remplace le contenu par :

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Clique sur **"Publier"**

⚠️ **NOTE** : Ces règles permettent à tout le monde de lire ET écrire. Pour plus de sécurité, tu peux restreindre l'écriture plus tard.

---

## ÉTAPE 2 : Héberger sur GitHub Pages

### 2.1 Créer un dépôt GitHub
1. Va sur https://github.com/
2. Connecte-toi (ou crée un compte)
3. Clique sur le bouton **"+"** en haut à droite → **"New repository"**
4. **Nom du repository** : `tournoi-jeux` (exactement)
5. **Public** (coché)
6. **Ne coche PAS** "Add a README file"
7. Clique sur **"Create repository"**

### 2.2 Uploader tes fichiers
**Méthode 1 - Via l'interface web (FACILE) :**
1. Sur la page de ton repository vide, clique sur **"uploading an existing file"**
2. Glisse-dépose tes 3 fichiers : `index.html`, `style.css`, `app.js`
3. En bas, écris "Premier commit" dans le message
4. Clique sur **"Commit changes"**

**Méthode 2 - Via Git (AVANCÉ) :**
```bash
git init
git add .
git commit -m "Premier commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/tournoi-jeux.git
git push -u origin main
```

### 2.3 Activer GitHub Pages
1. Dans ton repository, clique sur **"Settings"** (en haut)
2. Dans le menu à gauche, clique sur **"Pages"**
3. Sous "Source", choisis **"main"** branch
4. Clique sur **"Save"**
5. Attends 1-2 minutes

### 2.4 Ton site est en ligne ! 🎉
L'URL sera : `https://TON_USERNAME.github.io/tournoi-jeux/`

---

## ÉTAPE 3 : Configurer Firebase dans ton code

### 3.1 Ouvrir index.html
Dans ton fichier `index.html`, trouve cette section :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_PROJECT_ID.firebaseapp.com",
  // ...
};
```

### 3.2 Remplacer par ta configuration
Remplace **TOUTE** cette configuration par celle que tu as copiée à l'étape 1.4

### 3.3 Re-uploader sur GitHub
1. Retourne sur ton repository GitHub
2. Clique sur `index.html`
3. Clique sur l'icône **crayon** (Edit)
4. Colle ta nouvelle configuration Firebase
5. En bas, clique sur **"Commit changes"**
6. Attends 1 minute que GitHub Pages se mette à jour

---

## ÉTAPE 4 : Initialiser les données

### 4.1 Visiter ton site
Va sur `https://TON_USERNAME.github.io/tournoi-jeux/`

### 4.2 Ajouter les IPs admin
1. Ouvre `app.js` dans GitHub
2. Trouve cette ligne :
```javascript
const AUTHORIZED_IPS = [
    '127.0.0.1',
];
```
3. Ajoute ton IP (va sur https://www.monip.org/)
```javascript
const AUTHORIZED_IPS = [
    '127.0.0.1',
    'TON_IP_ICI',
];
```
4. Commit les changements

### 4.3 Vérifier que ça marche
1. Recharge ton site
2. Tu devrais voir **"✅ Connecté"** en haut
3. Tu devrais voir **"🔓 Admin"** (badge vert)
4. Les jeux doivent s'afficher

---

## ÉTAPE 5 : Partager avec tout le monde

### 5.1 Envoyer le lien
Envoie simplement : `https://TON_USERNAME.github.io/tournoi-jeux/`

### 5.2 Tout le monde voit les MÊMES données
- ✅ Si quelqu'un vote pour un jeu, tout le monde le voit EN DIRECT
- ✅ Si quelqu'un ajoute un score, tout le monde le voit EN DIRECT
- ✅ Synchronisation automatique en temps réel

### 5.3 Qui peut modifier ?
- **Admin (IPs autorisées)** : Peut ajouter/modifier/supprimer
- **Visiteurs** : Peuvent VOIR et VOTER uniquement

---

## 🔧 Problèmes fréquents

### "❌ Déconnecté" ou "🔄 Connexion..."
- Vérifie que tu as bien remplacé la config Firebase
- Vérifie que Realtime Database est activée
- Vérifie les règles de sécurité (read et write à true)

### Les données ne se synchronisent pas
- Ouvre la console (F12) → onglet "Console"
- Vérifie s'il y a des erreurs rouges
- Vérifie que l'URL de la database est correcte

### Je ne peux pas modifier
- Vérifie que ton IP est dans `AUTHORIZED_IPS`
- Recharge la page (Ctrl+F5)

### Le site ne se met pas à jour
- Attends 1-2 minutes après un commit
- Vide le cache (Ctrl+Shift+R ou Ctrl+F5)

---

## 📱 Voir les données en temps réel

Tu peux voir TOUTES les données dans Firebase Console :
1. Va sur https://console.firebase.google.com/
2. Clique sur ton projet
3. Clique sur "Realtime Database"
4. Tu verras l'arbre complet des données qui se mettent à jour EN DIRECT

---

## 🎯 Résumé

✅ Firebase = Base de données en temps réel (gratuit)
✅ GitHub Pages = Hébergement du site (gratuit)
✅ Tout le monde voit les MÊMES données
✅ Synchronisation automatique
✅ Fonctionne sur PC, mobile, tablette

---

## 📞 Support

Si ça ne marche pas :
1. Vérifie la console navigateur (F12)
2. Vérifie les règles Firebase
3. Vérifie que l'URL GitHub Pages est correcte
4. Relis le guide étape par étape

Bon tournoi ! 🎮🎲
