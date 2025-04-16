# 📝 Todo List MERN Stack

> **Une application complète de gestion de tâches développée avec la stack MERN**

## ✨ Fonctionnalités

- **Authentification sécurisée** : Inscription, connexion avec JWT et bcrypt
- **Gestion des tâches** : Création, lecture et suppression des tâches personnelles
- **Interface utilisateur intuitive** : Design responsive et retours visuels
- **Sécurité avancée** : Protection contre les injections, XSS et autres vulnérabilités

## 🛠️ Stack Technique

- **Frontend** : React.js, CSS, Axios
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : bcrypt pour le hachage des mots de passe

## 📋 Architecture du Projet

### Structure Backend

```
backend/
├── models/
│   ├── User.js       # Schéma utilisateur
│   └── Task.js       # Schéma tâche
├── routes/
│   ├── auth.js       # Routes d'authentification
│   └── tasks.js      # Routes CRUD des tâches
├── middleware/
│   └── auth.js       # Middleware de vérification JWT
├── server.js         # Point d'entrée du serveur
└── .env              # Variables d'environnement
```

### Structure Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── AuthForm.js    # Composant d'authentification
│   │   ├── TaskForm.js    # Formulaire d'ajout de tâches
│   │   └── TaskList.js    # Liste des tâches avec actions
│   ├── utils/
│   │   └── axiosConfig.js # Configuration d'Axios avec intercepteurs
│   ├── App.js             # Composant racine
│   └── index.js           # Point d'entrée React
└── public/
    └── index.html         # Template HTML
```

## 🚀 Mise en route

### Prérequis

- Node.js (v14.0 ou ultérieur)
- npm ou yarn
- MongoDB (instance locale ou Atlas)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votrenomdutilisateur/todo-mern-stack.git
   cd todo-mern-stack
   ```

2. **Configuration du backend**
   ```bash
   cd backend
   npm install
   ```
   
   Créez un fichier `.env` avec:
   ```
   MONGODB_URI=votre_chaine_de_connexion_mongodb
   PORT=5000
   JWT_SECRET=votre_secret_jwt
   ```

3. **Configuration du frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Démarrer les serveurs de développement**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm start
   ```

## 📊 Fonctionnalités CRUD

### Authentification

```javascript
// Backend - Inscription utilisateur
router.post("/register", async (req, res) => {
  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
});

// Backend - Connexion et génération JWT
router.post("/login", async (req, res) => {
  // Vérification du mot de passe
  const validPassword = await bcrypt.compare(password, user.password);
  // Génération du token
  const token = jwt.sign({ id: user._id }, "votre_secret_jwt", { expiresIn: "1h" });
});
```

### Gestion des Tâches

```javascript
// Récupération des tâches utilisateur
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// Ajout d'une nouvelle tâche
router.post("/", auth, async (req, res) => {
  const task = new Task({ 
    title: req.body.title, 
    user: req.user.id 
  });
  await task.save();
  res.json(task);
});

// Suppression d'une tâche
router.delete("/:id", auth, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ message: "Tâche supprimée" });
});
```

## 🔒 Sécurité

- **Hachage des mots de passe** avec bcrypt
- **Authentification JWT** avec vérification du token
- **Protection contre les injections** via Mongoose
- **Contrôle d'accès** basé sur l'identité utilisateur

## 🌟 Améliorations Potentielles

- **Fonctionnalités CRUD étendues** : Édition des tâches, marquage comme complétées
- **Améliorations UX/UI** : Thème sombre/clair, animations, interface mobile
- **Fonctionnalités additionnelles** : Catégorisation, dates d'échéance, partage
- **Aspects techniques** : Tests, CI/CD, documentation API, optimisation

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## 👥 Contributeurs

- [Votre Nom](https://github.com/votrenomdutilisateur)

---

*Note : Ce README a été mis à jour le 16 avril 2025.*
