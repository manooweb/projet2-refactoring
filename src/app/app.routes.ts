import { Routes } from '@angular/router';

import { CountryDetailComponent } from './country-detail/country-detail.component';
import { HomeComponent } from './dashboard/home.component';
import { NotFoundComponent } from './not-found-page/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'country/:countryName',
    component: CountryDetailComponent,
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
