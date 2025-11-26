# 🚀 RemakeKayot

Application web moderne développée avec Angular 20, intégrant Supabase comme backend et containerisée avec Docker.

## 📋 Description

RemakeKayot est une application Angular full-stack utilisant une architecture moderne avec authentification, visualisation de données via des graphiques et une interface utilisateur responsive construite avec Tailwind CSS et Angular Material.

## 🛠️ Stack Technique

- **Frontend Framework**: Angular 20. 1.x
- **Langage**: TypeScript 5.8
- **Styling**: Tailwind CSS 4.x + Angular Material
- **Backend**: Supabase
- **Authentification**: Auth0 + JWT
- **Graphiques**: Chart.js + CanvasJS
- **Containerisation**: Docker + Docker Compose
- **UI Components**: Flowbite

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée (Auth0 + Supabase)
- 📊 Visualisation de données avec graphiques interactifs
- 🎨 Interface moderne et responsive
- 🐳 Déploiement simplifié avec Docker
- 📱 Design mobile-first avec Tailwind CSS
- ⚡ Performance optimisée avec Angular 20

## 📦 Prérequis

- Node.js 22.x
- Docker & Docker Compose (optionnel)
- Un compte Supabase
- Un compte Auth0 (optionnel selon configuration)

## 🚀 Installation

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github. com/pileemile/remakeKayot.git
cd remakeKayot
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations :
```env
# Frontend
FRONT=remake-kayot-front
FRONT_PORT=4200

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Auth0 (si utilisé)
AUTH0_DOMAIN=your_domain
AUTH0_CLIENT_ID=your_client_id
```

4. **Lancer le serveur de développement**
```bash
npm start
```

L'application sera accessible sur `http://localhost:4200/`

### Installation avec Docker

1. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer . env avec vos configurations
```

2.  **Lancer avec Docker Compose**
```bash
docker-compose up -d
```

3. **Accéder à l'application**
```
http://localhost:4200
```

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance le serveur de développement |
| `npm run build` | Compile le projet pour la production |
| `npm run watch` | Compile en mode développement avec watch |
| `npm test` | Lance les tests unitaires avec Karma |
| `ng generate component <name>` | Génère un nouveau composant |

## 🏗️ Structure du projet

```
remakeKayot/
├── src/                    # Code source de l'application
│   ├── app/               # Modules et composants Angular
│   ├── assets/            # Fichiers statiques
│   └── environments/      # Configuration par environnement
├── supabase/              # Configuration Supabase
├── public/                # Fichiers publics
├── scripts/               # Scripts de déploiement
├── Dockerfile             # Configuration Docker
├── docker-compose. yaml    # Orchestration Docker
├── tailwind.config.js     # Configuration Tailwind
└── angular.json           # Configuration Angular

```

## 🔧 Configuration Supabase

1.  Créer un projet sur [Supabase](https://supabase.com)
2.  Copier l'URL du projet et la clé anonyme
3. Les ajouter dans le fichier `.env`
4. Configurer les tables et authentification selon vos besoins

## 🧪 Tests

Lancer les tests unitaires :
```bash
npm test
```

## 📦 Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

## 🐳 Déploiement Docker

### Build de l'image
```bash
docker-compose build
```

### Lancer le conteneur
```bash
docker-compose up -d
```

### Arrêter le conteneur
```bash
docker-compose down
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 License

Ce projet est privé et à usage personnel.

## 👤 Auteur

**pileemile**
- GitHub: [@pileemile](https://github.com/pileemile)

## 🔗 Ressources

- [Documentation Angular](https://angular.dev)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss. com/docs)
- [Angular CLI](https://angular.dev/tools/cli)

---

⭐ N'oubliez pas de laisser une étoile si ce projet vous plaît ! 
