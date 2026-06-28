import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from "../components/header/header.component";
import { KpiList } from '../components/kpi-list/kpi.model';
import { MedalChartComponent } from '../components/medal-chart/medal-chart.component';
import { MedalChartService } from '../serices/medal-chart.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    HeaderComponent,
    MedalChartComponent
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly medalChartService = inject(MedalChartService);
  private olympics$!: Observable<Olympic[]>;
  kpiList$!: Observable<KpiList>;
  chartId = 'DashboardPieChart';
  chart!: Chart;
  error!: string

  ngOnInit() {
    this.olympics$ = this.dataService.getAllOlympics().pipe(
      tap((olympics: Olympic[]) => {
        if (olympics.length > 0) {
          const countries: string[] = olympics.map((i: Olympic) => i.country);
          const medals = olympics.map((i: Olympic) => i.participations.map(i => i.medalsCount));
          const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc, i) => acc + i, 0));
          const chartData: ChartConfiguration = this.buildChartData(countries, sumOfAllMedalsYears);
          this.chart?.destroy();
          this.chart = this.medalChartService.createChart(
            this.chartId,
            chartData,
            (countryName: string) => { this.router.navigate(['country', countryName]) }
          );
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.error = error.message;
        return of([]);
      }),
      shareReplay(1)
    );

    this.kpiList$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const years = olympics.flatMap((i: Olympic) => i.participations.map((f) => f.year));

        return {
          title: 'Medals per Country',
          kpis: [
            {
              label: 'Number of countries',
              value: olympics.length
            },
            {
              label: 'Number of JOs',
              value: new Set(years).size
            },
          ]
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
  
  private buildChartData(countries: string[], sumOfAllMedalsYears: number[]): ChartConfiguration {
    return {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', '#E69500'],
          hoverOffset: 4
        }],
      },
    };
  }
}

