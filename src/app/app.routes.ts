import { Routes } from '@angular/router';

import { CountryComponent } from './country-detail/country.component';
import { HomeComponent } from './dashboard/home.component';
import { NotFoundComponent } from './not-found-page/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'country/:countryName',
    component: CountryComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
