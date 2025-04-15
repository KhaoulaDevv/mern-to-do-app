Rapport détaillé du Projet - Application Todo List MERN Stack

1. Introduction et contexte
Le TP n°4 propose le développement d'une application web de gestion de tâches (To-Do List) basée sur le stack MERN, une combinaison puissante de technologies web modernes. Cette architecture complète comprend :
MongoDB : Base de données NoSQL orientée documents
Express.js: Framework backend minimalist pour Node.js
React: Bibliothèque JavaScript pour construire des interfaces utilisateur
Node.js : Environnement d'exécution JavaScript côté serveur
L'objectif pédagogique de ce TP est d'acquérir des compétences dans :
La conception d'une API REST
L'implémentation d'un système d'authentification sécurisé
La gestion d'état dans une application React
La communication entre le frontend et le backend
La gestion des données utilisateurs personnalisés

2. Architecture détaillée du projet
2.1 Structure des dossiers et fichiers
Les modèles backend définissent la structure des données manipulées par les routes
Les routes backend exposent les API consommées par les composants frontend
Le middleware d'authentification protège les routes sensibles
Les composants frontend s'organisent hiérarchiquement avec App.js comme racine
La configuration Axios centralise la gestion des requêtes API et l'authentification
Cette organisation modulaire facilite la maintenance et permet de travailler simultanément sur différentes parties de l'application. Elle respecte les principes de séparation des préoccupations, chaque fichier ayant une responsabilité unique et clairement définie.
2.2 Architecture backend
2.2.1 Modèles de données (Mongoose Schemas)
User Schema: Définit la structure des données utilisateur avec: 
email: Identifiant unique (String, required, unique)
password: Mot de passe hashé (String, required)
createdAt: Date de création (Date, default: Date.now)

Task Schema: Définit la structure des tâches avec: 
title: Description de la tâche (String, required)
completed: État de la tâche (Boolean, default: false)
user: Référence à l'utilisateur propriétaire (ObjectId, ref: "User")
createdAt: Date de création (Date, default: Date.now)
2.2.2 Middleware d'authentification
Le middleware auth.js vérifie la validité du token JWT pour chaque requête protégée:
Extraction du token de l'en-tête Authorization
Vérification du token avec la clé secrète
Décodage des informations utilisateur
Ajout des informations utilisateur à l'objet request

2.2.3 Routes API
Routes d'authentification (/api/auth): 
POST /register: Création d'un nouvel utilisateur avec hachage du mot de passe
POST /login: Vérification des identifiants et génération d'un token JWT
Routes de gestion des tâches (/api/tasks): 
GET /: Récupération des tâches de l'utilisateur connecté
POST /: Ajout d'une nouvelle tâche
DELETE /:id: Suppression d'une tâche spécifique
2.2.4 Configuration du serveur
Le fichier server.js comprend:
Configuration d'Express et middlewares (cors, json)
Connection à MongoDB via mongoose
Enregistrement des routes
Gestion des variables d'environnement
2.3 Architecture frontend
2.3.1 Configuration d'Axios
Le fichier axiosConfig.js centralise:
La configuration de l'URL de base de l'API
L'ajout automatique du token JWT aux en-têtes HTTP
La gestion globale des requêtes et réponses
2.3.2 Composants React
AuthForm: Gère l'inscription/connexion avec: 
État local pour email/password
Toggle entre modes inscription/connexion
Soumission des formulaires et gestion des erreurs
Stockage du token dans localStorage
TaskForm: Interface d'ajout de tâches avec: 
Champ de saisie pour le titre de la tâche
Gestion de la soumission et ajout en temps réel
TaskList: Affichage et gestion des tâches avec: 
Rendu de la liste des tâches de l'utilisateur
Suppression des tâches avec confirmation visuelle
2.3.3 Gestion d'état
Utilisation des hooks React pour la gestion d'état locale
Propagation de l'état via les props entre composants
Communication avec l'API pour maintenir la cohérence des données
2.3.4 Styles et UI
Utilisation de CSS pour styliser les composants
Interface responsive et intuitive
Feedback visuel pour les actions utilisateur
3. Implémentation technique détaillée
3.1 Authentification et sécurité
3.1.1 Hachage des mots de passe
// Hachage du mot de passe lors de l'inscription
const hashedPassword = await bcrypt.hash(password, 10);
const user = new User({ email, password: hashedPassword });
3.1.2 Génération et vérification du token JWT
// Génération du token lors de la connexion const token = jwt.sign({ id: user._id }, "votre_secret_jwt", { expiresIn: "1h", });
// Vérification du token dans le middleware const decoded = jwt.verify(token, "votre_secret_jwt"); req.user = decoded;
3.1.3 Stockage et utilisation du token côté client
// Stockage du token après connexion
localStorage.setItem("token", res.data.token);
 
// Récupération du token pour les requêtes API
const token = localStorage.getItem("token");
config.headers.Authorization = `Bearer ${token}`;

3.2 Opérations CRUD des tâches
3.2.1 Création de tâche
// Backend - Route POST pour ajouter une tâche
router.post("/", auth, async (req, res) => {
  const task = new Task({ 
    title: req.body.title, 
    user: req.user.id 
  });
  await task.save();
  res.json(task);
});
 
// Frontend - Ajout de tâche via Axios
const res = await api.post("/tasks", { title: newTask });
setTasks((prev) => [...prev, res.data]);

3.2.2 Récupération des tâches
// Backend - Route GET pour récupérer les tâches
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});
 
// Frontend - Chargement des tâches dans useEffect
useEffect(() => {
  if (token) {
    api.get("/tasks")
      .then((res) => setTasks(res.data))
      .catch(() => {
        setToken("");
        localStorage.removeItem("token");
      });
  }
}, [token]);

3.2.3 Suppression de tâche
// Backend - Route DELETE pour supprimer une tâche
router.delete("/:id", auth, async (req, res) => {
  const task = await Task.findOne({ 
    _id: req.params.id, 
    user: req.user.id 
  });
  if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
  await Task.deleteOne({ _id: req.params.id });
  res.json({ message: "Tâche supprimée" });
});
 
// Frontend - Suppression de tâche et mise à jour de l'UI
const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
  setTasks((prev) => prev.filter((task) => task._id !== id));
};

3.3 Gestion des erreurs
3.3.1 Validation des entrées
// Validation basique côté serveur
if (!email || !password) {
  return res.status(400).json({ message: "Tous les champs sont requis" });
}
 
// Vérification d'email unique
try {
  const user = new User({ email, password: hashedPassword });
  await user.save();
} catch (err) {
  res.status(400).json({ message: "Email déjà utilisé" });
}

3.3.2 Gestion des erreurs API
// Structure try/catch pour les opérations asynchrones
try {
  // Opérations de base de données
} catch (err) {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
}
 
// Côté client
try {
  const res = await api.post("/tasks", { title: newTask });
  // Mise à jour de l'état
} catch (err) {
  alert("Erreur lors de l'ajout de la tâche");
}

4. Analyse approfondie des aspects techniques
4.1 Sécurité
4.1.1 Protection contre les attaques courantes
Injection: Mongoose fournit une validation des schémas qui limite les risques d'injection
XSS: Express.js et React offrent une protection par défaut contre les attaques XSS
CSRF: L'utilisation de tokens JWT dans les en-têtes HTTP réduit les risques de CSRF
4.1.2 Bonnes pratiques de sécurité implémentées
Hachage des mots de passe avec bcrypt et salt
Authentification par token avec durée de validité limitée
Contrôle d'accès aux ressources basé sur l'identité utilisateur
Gestion des erreurs sans divulgation d'informations sensibles
4.1.3 Points d'amélioration potentiels
Utilisation de variables d'environnement pour le secret JWT
Implémentation de refresh tokens
Validation plus stricte des entrées utilisateur
HTTPS pour les communications en production
4.2 Performance et optimisation
4.2.1 Optimisations backend
Utilisation de MongoDB pour des requêtes rapides sur documents
Index sur les champs fréquemment utilisés (email dans User)
Projection des champs nécessaires uniquement
4.2.2 Optimisations frontend
Gestion efficace des états avec React Hooks
Mise à jour conditionnelle avec useEffect
Communication optimisée avec l'API via Axios
4.3 Maintenabilité et évolutivité
4.3.1 Structure modulaire
Séparation claire des responsabilités (routes, modèles, middleware)
Composants React indépendants et réutilisables
Configuration centralisée (axiosConfig, .env)
4.3.2 Potentiel d'extension
Architecture prête pour l'ajout de nouvelles fonctionnalités
Modèles de données extensibles
API RESTful facilement enrichissable
5. Fonctionnalités avancées et améliorations potentielles
5.1 Fonctionnalités CRUD étendues
Édition des tâches existantes
Marquage des tâches comme complétées
Filtre des tâches par statut
5.2 Améliorations UX/UI
Animations et transitions pour les interactions
Mode sombre/clair
Interface responsive pour mobile
Feedback visuel amélioré pour les actions
5.3 Fonctionnalités additionnelles
Catégorisation des tâches avec tags
Dates d'échéance et rappels
Partage de listes de tâches entre utilisateurs
Importation/exportation des données
5.4 Aspects techniques à développer
Tests unitaires et d'intégration
Déploiement CI/CD
Documentation API avec Swagger
Optimisation des performances et monitoring
6. Conclusion
Ce projet MERN Stack représente une implémentation complète d'une application web moderne avec authentification et fonctionnalités CRUD. Il démontre l'intégration réussie des technologies complémentaires qui forment un écosystème JavaScript cohérent de bout en bout.
L'architecture bien structurée, la séparation des préoccupations et l'application des bonnes pratiques en matière de sécurité font de ce projet une base solide pour le développement d'applications web plus complexes. Les étudiants qui réalisent ce TP acquièrent des compétences essentielles dans les technologies web actuelles et une compréhension approfondie de l'architecture full-stack.
Le projet, bien que fonctionnel dans son état actuel, offre de nombreuses opportunités d'amélioration et d'extension, permettant aux étudiants d'approfondir leurs compétences dans des domaines spécifiques selon leurs intérêts.
