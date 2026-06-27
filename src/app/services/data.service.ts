import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Olympic } from '../models/olympic.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly httpClient = inject(HttpClient);
  private readonly olympicUrl = './assets/mock/olympic.json';


  getAllOlympics(): Observable<Olympic[]> {
    return this.httpClient.get<Olympic[]>(this.olympicUrl);
  }

  getCountryByName(countryName: string): Observable<Olympic | undefined> {
    return this.getAllOlympics().pipe(
      map((olympics: Olympic[]) => olympics.find((country: Olympic) => country.country === countryName))
    );
  }
}
