import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Olympic } from '../models/olympic.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly httpClient = inject(HttpClient);
  private readonly olympicUrl = './assets/mock/olympic.json';


  getAllOlympics(): Observable<Olympic[]> {
    return this.httpClient.get<Olympic[]>(this.olympicUrl);
  }

}
