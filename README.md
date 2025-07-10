# Maixer - Générateur de Recettes Alimenté par l'IA

Maixer est une application web innovante qui permet aux utilisateurs de générer des recettes personnalisées grâce à l'intelligence artificielle, consulter des informations nutritionnelles détaillées et rechercher des recettes selon différents critères.

## ✨ Fonctionnalités

### 🍳 Génération de Recettes Personnalisées

- Création de recettes uniques basées sur vos ingrédients disponibles
- Prise en compte du nombre de portions souhaité
- Adaptation selon vos allergies et intolérances alimentaires
- Génération automatique d'étapes de préparation détaillées

### 🔍 Recherche et Navigation

- Consultation de toutes les recettes générées précédemment
- Recherche avancée par :
  - Nom de la recette
  - Ingrédients spécifiques
  - Type de plat (entrée, plat principal, dessert, etc.)
- Interface intuitive avec navigation fluide

### 📊 Analyse Nutritionnelle Complète

- Calcul automatique des valeurs nutritionnelles :
  - Calories par portion
  - Protéines, glucides et lipides
  - Vitamines essentielles
  - Minéraux et oligo-éléments
- Visualisation claire des informations nutritionnelles

### 👤 Gestion des Utilisateurs

- Système d'authentification sécurisé
- Profils utilisateur personnalisés
- Historique des recettes générées
- Sauvegarde des préférences alimentaires

## 🚀 Technologies Utilisées

### Frontend

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour une meilleure robustesse
- **Tailwind CSS v4** - Framework CSS utilitaire moderne
- **shadcn/ui** - Composants UI avec style New York
- **Radix UI** - Composants primitifs accessibles

### Backend & Services

- **API Routes Next.js** - Endpoints API intégrés
- **NextAuth.js v4** - Authentification complète
- **Airtable SDK** - Base de données cloud
- **Groq SDK** - Intelligence artificielle pour génération de recettes
- **react-hook-form** - Gestion des formulaires
- **Zod** - Validation des schémas de données

### Développement

- **ESLint** - Analyse statique du code
- **Turbopack** - Bundler ultra-rapide
- **Docker** - Conteneurisation

## 📋 Prérequis

- Node.js 20.x ou supérieur
- Compte Airtable avec clé API
- Clé API Groq pour l'IA
- Git pour le contrôle de version

## ⚙️ Installation

### 1. Cloner le Projet

```bash
git clone https://github.com/PedroDSS/maixer.git
cd maixer
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configuration des Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
# NextAuth Configuration
NEXTAUTH_SECRET=votre-secret-nextauth-ultra-securise
NEXTAUTH_URL=http://localhost:3000

# Airtable Configuration
AIRTABLE_API_KEY=votre-cle-api-airtable
AIRTABLE_BASE_ID=votre-base-id-airtable
AIRTABLE_USERS_TABLE=Users
AIRTABLE_RECIPES_TABLE=Recipes
AIRTABLE_INGREDIENTS_TABLE=Ingredients

# Groq AI Configuration
GROQ_API_KEY=votre-cle-api-groq
```

### 4. Configuration Airtable

Créez une base Airtable avec les tables suivantes :

#### Table `Users`

- **Name** (Texte court)
- **Email** (Texte court)
- **Password** (Texte court)
- **CreatedAt** (Texte court)

#### Table `Recipes`

- **Name** (Texte court)
- **Description** (Texte long)
- **Ingredients** (Texte long, format JSON)
- **Steps** (Texte long, format JSON)
- **Servings** (Nombre)
- **PrepTime** (Nombre)
- **CookTime** (Nombre)
- **DishType** (Texte court)
- **Allergens** (Texte long, format JSON)
- **NutritionalInfo** (Texte long, format JSON)
- **CreatedAt** (Texte court)
- **UserId** (Texte court)

#### Table `Ingredients`

- **Name** (Texte court)
- **Category** (Texte court)

## 🏃‍♂️ Lancement

### Mode Développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Mode Production

```bash
npm run build
npm start
```

### Autres Commandes

```bash
# Vérification du code
npm run lint

# Avec Docker
docker-compose up
```

## 🏗️ Structure du Projet

```
maixer/
├── src/
│   ├── app/                    # Pages et routes API (App Router)
│   │   ├── api/               # Endpoints API
│   │   │   ├── auth/         # Authentification
│   │   │   ├── recipes/      # Gestion des recettes
│   │   │   └── ingredients/  # Gestion des ingrédients
│   │   ├── recipes/          # Pages des recettes
│   │   ├── login/           # Page de connexion
│   │   └── register/        # Page d'inscription
│   ├── components/           # Composants React réutilisables
│   │   ├── ui/              # Composants UI (shadcn/ui)
│   │   ├── Header.tsx       # En-tête de l'application
│   │   ├── RecipeCard.tsx   # Carte de recette
│   │   └── NutritionInfo.tsx # Informations nutritionnelles
│   ├── lib/                 # Services et utilitaires
│   │   ├── airtable.ts     # Service Airtable
│   │   ├── groq.ts         # Service IA Groq
│   │   ├── validation.ts   # Schémas de validation
│   │   └── utils.ts        # Fonctions utilitaires
│   ├── types/              # Définitions TypeScript
│   └── middleware.ts       # Middleware Next.js
├── public/                 # Assets statiques
├── CLAUDE.md              # Instructions pour Claude Code
├── TODO.md               # Liste des tâches
└── README.md            # Documentation (ce fichier)
```

## 🎯 Fonctionnalités Principales

### Génération de Recettes

L'IA Groq analyse vos ingrédients et préférences pour créer des recettes originales avec :

- Instructions étape par étape
- Temps de préparation et cuisson
- Analyse nutritionnelle automatique
- Suggestions d'accompagnements

### Interface Utilisateur

- Design responsive et moderne
- Navigation intuitive
- Animations fluides
- Thème adaptatif
- Expérience utilisateur optimisée

### Gestion des Données

- Stockage sécurisé dans Airtable
- Authentification robuste
- Synchronisation en temps réel
- Sauvegarde automatique

## 🔒 Sécurité

- Chiffrement des mots de passe avec bcrypt
- Authentification par tokens JWT
- Validation des données côté client et serveur
- Protection contre les injections
- Sessions sécurisées

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé dans le cadre d'un projet ESGI - 5IW - Promotion 2025

---

**Maixer** - Transformez vos ingrédients en chefs-d'œuvre culinaires ! 🍳✨
