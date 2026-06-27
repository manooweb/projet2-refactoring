import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from "../components/header/header.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [AsyncPipe, HeaderComponent]
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private olympics$!: Observable<Olympic[]>;
  pieChart!: Chart<"pie", number[], string>;
  error!: string
  titlePage = "Medals per Country";
  totalJOs$!: Observable<number>;
  totalCountries$!: Observable<number>;

  ngOnInit() {
    this.olympics$ = this.dataService.getAllOlympics().pipe(
      tap((olympics: Olympic[]) => {
        if (olympics.length > 0) {
          const countries: string[] = olympics.map((i: Olympic) => i.country);
          const medals = olympics.map((i: Olympic) => i.participations.map(i => i.medalsCount));
          const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc, i) => acc + i, 0));
          this.buildPieChart(countries, sumOfAllMedalsYears);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.error = error.message;
        return of([]);
      }),
      shareReplay(1)
    );

    this.totalJOs$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const years = olympics.flatMap((i: Olympic) => i.participations.map((f) => f.year));
        return new Set(years).size;
      })
    );

    this.totalCountries$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => olympics.length)
    );
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[]) {
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              this.router.navigate(['country', countryName]);
            }
          }
        }
      }
    });
    this.pieChart = pieChart;
  }
}

