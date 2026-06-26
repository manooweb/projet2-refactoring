import { Routes } from '@angular/router';

import { CountryDetailComponent } from './country-detail/country-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'country/:countryName',
    component: CountryDetailComponent,
  },
  {
    path: 'not-found',
    component: NotFoundPageComponent,
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
