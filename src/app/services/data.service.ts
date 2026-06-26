import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Olympic } from '../models/olympic.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly httpClient = inject(HttpClient);

  getAllOlympics(): Observable<Olympic[]> {
    return of([]);
  }

}
