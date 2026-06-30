# Architecture

Ce document décrit l'organisation front-end de l'application Olympic Games après refactoring.

## Objectif

L'application affiche des statistiques olympiques à partir d'un jeu de données local. Le refactoring a eu pour objectif de clarifier l'organisation du code, de centraliser l'accès aux données, de renforcer le typage TypeScript et de découper l'interface en composants réutilisables.

## Vue d'ensemble

L'application repose sur une architecture Angular avec composants standalone. Les anciennes pages ont été remplacées par des composants de page dédiés :

- `DashboardComponent` pour la page d'accueil ;
- `CountryDetailComponent` pour la page de détail d'un pays ;
- `NotFoundPageComponent` pour les routes inconnues et les pays inexistants.

Les composants de page orchestrent l'affichage, mais les responsabilités communes sont déplacées dans des services ou des composants réutilisables.

## Organisation des dossiers

```text
src/
├── app/
│   ├── components/
│   │   ├── back-button/
│   │   ├── error/
│   │   ├── header/
│   │   ├── kpi-card/
│   │   ├── kpi-list/
│   │   ├── loading-spinner/
│   │   └── medal-chart/
│   ├── constants/
│   │   └── error-messages.ts
│   ├── country-detail/
│   ├── dashboard/
│   ├── models/
│   │   └── olympic.model.ts
│   ├── not-found-page/
│   ├── services/
│   │   ├── data.service.ts
│   │   └── medal-chart.service.ts
│   └── app.routes.ts
└── assets/
    └── mock/
        └── olympic.json
```

## Routing

Les routes sont définies dans `src/app/app.routes.ts`.

| Route | Composant | Rôle |
| --- | --- | --- |
| `/` | `DashboardComponent` | Affiche le tableau de bord global. |
| `/country/:countryName` | `CountryDetailComponent` | Affiche les statistiques d'un pays. |
| `/not-found` | `NotFoundPageComponent` | Affiche une erreur de navigation ou de pays inconnu. |
| `**` | `NotFoundPageComponent` | Gère les routes inconnues. |

Le pays sélectionné est transmis dans l'URL avec son nom. La page de détail récupère ce paramètre via `ActivatedRoute`.

## Accès aux données

L'accès aux données est centralisé dans `DataService`.

```text
DashboardComponent / CountryDetailComponent
        ↓
DataService
        ↓
HttpClient
        ↓
src/assets/mock/olympic.json
```

Le fichier `src/assets/mock/olympic.json` sert de source de données locale. Il simule une réponse HTTP et pourra être remplacé plus tard par une vraie API sans modifier directement les composants de page.

Le service expose deux méthodes principales :

- `getAllOlympics()` pour récupérer l'ensemble des données ;
- `getCountryByName(countryName)` pour récupérer un pays à partir du nom présent dans l'URL.

## Typage

Les données olympiques sont décrites dans `src/app/models/olympic.model.ts`.

```ts
export interface Participation {
  id: number,
  year: number,
  city: string,
  medalsCount: number,
  athleteCount: number
}

export interface Olympic {
  id: number,
  country: string,
  participations: Participation[]
}
```

Ces interfaces évitent l'utilisation de `any` dans les traitements liés aux pays, aux participations, aux médailles et aux athlètes.

## Composants réutilisables

Les éléments communs de l'interface sont placés dans `src/app/components`.

| Composant | Rôle |
| --- | --- |
| `HeaderComponent` | Affiche le titre de l'application et les KPI de la page quand ils existent. |
| `KpiListComponent` | Affiche un groupe de KPI. |
| `KpiCardComponent` | Affiche un KPI individuel. |
| `MedalChartComponent` | Fournit le canvas utilisé par Chart.js. |
| `BackButtonComponent` | Permet de revenir à la page dashboard. |
| `LoadingSpinnerComponent` | Affiche un état de chargement. |
| `ErrorComponent` | Affiche un message d'erreur et une action optionnelle. |

Ce découpage limite la duplication entre les pages et rend les éléments d'interface plus faciles à faire évoluer.

## Graphiques

Les graphiques utilisent Chart.js.

La création des instances Chart.js est centralisée dans `MedalChartService`. Les composants de page préparent les labels et les données, puis délèguent la création du graphique au service.

Cette séparation permet de ne pas dupliquer la configuration Chart.js dans les pages et facilite la destruction des graphiques lors du cycle de vie Angular.

## Gestion des états

L'application gère plusieurs états utilisateur :

- chargement des données ;
- erreur technique lors du chargement ;
- jeu de données global vide ;
- pays inexistant ;
- route inconnue.

Les pages s'appuient sur RxJS, `AsyncPipe` et des observables pour limiter les souscriptions manuelles dans les composants.

## Qualité et validation

Le projet dispose de scripts npm pour vérifier l'application :

```bash
npm run build
npm test
npm run lint
```

Le linting Angular est configuré avec ESLint. Les tests unitaires sont exécutés en mode headless avec Karma et ChromeHeadless.

## Limites connues

L'application utilise encore un fichier JSON local au lieu d'une API backend réelle.

La route de détail utilise actuellement le nom du pays dans l'URL (`/country/:countryName`). Une évolution possible serait d'utiliser l'identifiant du pays pour rendre l'URL moins dépendante du libellé affiché.
