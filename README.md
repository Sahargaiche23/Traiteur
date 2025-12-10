# Traiteur Saida Fejjari Chouaieb 🍽️

Application web complète pour un service traiteur en Tunisie avec livraison.

## Fonctionnalités

### Pour les clients
- 📋 **Catalogue des plats** - Parcourez nos plats traditionnels tunisiens
- 🛒 **Commande en ligne** - Ajoutez au panier et commandez facilement
- ❤️ **Menus préférés** - Créez et sauvegardez vos menus personnalisés
- 📍 **Suivi de commande** - Suivez votre commande en temps réel
- 💬 **Posts & Commentaires** - Interagissez avec nos publications

### Pour l'administration
- 📊 **Dashboard** - Vue d'ensemble des commandes et statistiques
- 🍴 **Gestion des plats** - Ajouter, modifier, supprimer des plats
- 📦 **Gestion des commandes** - Suivi et mise à jour des statuts
- ⚙️ **Paramètres** - Configuration du service

## Technologies

### Frontend
- **React 18** - Framework UI
- **React Router** - Navigation
- **TailwindCSS** - Styles
- **Framer Motion** - Animations
- **Lucide React** - Icônes
- **Zustand** - State management

### Backend
- **Node.js** - Runtime
- **Express** - Framework API
- **CORS** - Cross-origin support

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer le backend (dans un autre terminal)
npm run server

# Ou lancer les deux en même temps
npm run dev:all
```

## Structure du projet

```
├── public/
│   └── favicon.svg
├── server/
│   └── index.js          # API Backend
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── data/
│   │   └── dishes.js     # Données initiales
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Catalog.jsx
│   │   ├── DishDetail.jsx
│   │   ├── MenuBuilder.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Profile.jsx
│   │   ├── OrderTracking.jsx
│   │   └── Admin.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## API Endpoints

### Plats
- `GET /api/dishes` - Liste des plats
- `GET /api/dishes/:id` - Détail d'un plat
- `POST /api/dishes` - Créer un plat
- `PUT /api/dishes/:id` - Modifier un plat
- `DELETE /api/dishes/:id` - Supprimer un plat

### Commandes
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détail d'une commande
- `POST /api/orders` - Créer une commande
- `PATCH /api/orders/:id/status` - Mettre à jour le statut

### Menus personnalisés
- `GET /api/menus` - Liste des menus
- `POST /api/menus` - Créer un menu
- `PUT /api/menus/:id` - Modifier un menu
- `DELETE /api/menus/:id` - Supprimer un menu

### Posts
- `GET /api/posts` - Liste des posts
- `POST /api/posts` - Créer un post
- `POST /api/posts/:id/like` - Liker un post
- `POST /api/posts/:id/comments` - Commenter un post

## Hébergement en Tunisie

Recommandations pour l'hébergement:
- **VPS Basic** (~30 TND/mois): Atlax, SJR, Hodi
- **Domaine .tn**: Pour visibilité locale
- **SSL**: Let's Encrypt (gratuit)

## Licence

© 2025 Traiteur Saida Fejjari Chouaieb. Tous droits réservés.
