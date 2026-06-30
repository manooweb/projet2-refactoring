# Olympic Games

Angular application displaying Olympic medal statistics from a local mock dataset.

The application provides a dashboard with a medals-by-country chart and a country detail page with participation statistics.

## Prerequisites

- Node.js 20
- npm

## Installation

Install project dependencies:

```bash
npm install
```

## Available Scripts

Start the development server:

```bash
npm start
```

The application is available at `http://localhost:4200/`.

Build the application:

```bash
npm run build
```

Build artifacts are generated in the `dist/` directory.

Run unit tests:

```bash
npm test
```

Run lint checks:

```bash
npm run lint
```

## Features

- Dashboard with medals grouped by country.
- Country detail page with Olympic participation data.
- Reusable KPI, chart, header, loading and error components.
- Route handling for unknown URLs and unknown countries.
- Error handling for technical loading errors and empty global datasets.
- Typed Olympic data models.
- Responsive layout.

## Project Structure

- `src/app/app.routes.ts`: application routes.
- `src/app/dashboard`: dashboard page.
- `src/app/country-detail`: country detail page.
- `src/app/not-found-page`: fallback page for unknown routes and invalid country URLs.
- `src/app/components`: reusable UI components.
- `src/app/services`: data access and chart creation services.
- `src/app/models`: TypeScript interfaces for Olympic data.
- `src/app/constants`: shared application constants.
- `src/assets/mock/olympic.json`: local mock dataset.

## Data Source

The application uses `src/assets/mock/olympic.json` as its data source.

The expected data format is:

```ts
interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}

interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}
```

## Error Handling

The application handles the following cases:

- Unknown route: redirects to the not-found page.
- Unknown country: displays the not-found page with a dedicated message.
- Technical loading error: displays an error message.
- Empty global dataset: displays a technical error message on the dashboard.

## Limitations

- The application uses a local JSON file and does not call a real backend API.
- Unit tests mostly cover component creation and setup; deeper functional test coverage is outside this project scope.
- Chart rendering relies on Chart.js.
- The dataset is expected to match the TypeScript models.

## Main Dependencies

- Angular 18
- RxJS 7
- Chart.js 4
