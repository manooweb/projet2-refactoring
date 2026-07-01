import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';
import { catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from "../components/header/header.component";
import { KpiList } from '../components/kpi-list/kpi.model';
import { MedalChartComponent } from '../components/medal-chart/medal-chart.component';
import { MedalChartService } from '../services/medal-chart.service';
import { ErrorComponent } from '../components/error/error.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    HeaderComponent,
    MedalChartComponent,
    ErrorComponent,
    LoadingSpinnerComponent
  ]
})
export class DashboardComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);
  private readonly medalChartService = inject(MedalChartService);
  // kpiList$!: Observable<KpiList>;
  chartId = 'DashboardPieChart';
  chart!: Chart;
  errorMessage!: string;
  actionMessage!: string;

  loading = signal(true);

  private olympics$: Observable<Olympic[]> = this.dataService.getAllOlympics().pipe(
    tap((olympics: Olympic[]) => {
      if (olympics.length === 0) {
        this.setTechnicalError();
        return;
      }

      const countryNames: string[] = olympics.map((country: Olympic) => country.country);
      const medals = olympics.map((country: Olympic) => country.participations.map((participation) => participation.medalsCount));
      const totalMedalsByCountry = medals.map((medalCounts) => medalCounts.reduce((total, count) => total + count, 0));
      const chartData: ChartConfiguration = this.buildChartData(countryNames, totalMedalsByCountry);
      this.chart?.destroy();
      this.chart = this.medalChartService.createChart(
        this.chartId,
        chartData,
        (countryName: string) => { void this.router.navigate(['country', countryName]) }
      );
    }),
    catchError(() => {
      this.setTechnicalError();
      return of([]);
    }),
    shareReplay(1)
  );

  protected kpiList$: Observable<KpiList> = this.olympics$.pipe(
    map((olympics: Olympic[]) => {
      const years = olympics.flatMap((country: Olympic) => country.participations.map((participation) => participation.year));

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
    }),
    finalize(() => {
      this.loading.set(false);
    }),
  );

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChartData(countryNames: string[], totalMedalsByCountry: number[]): ChartConfiguration {
    return {
      type: 'pie',
      data: {
        labels: countryNames,
        datasets: [{
          label: 'Medals',
          data: totalMedalsByCountry,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', '#E69500'],
          hoverOffset: 4
        }],
      },
    };
  }

  private setTechnicalError(): void {
    this.errorMessage = ERROR_MESSAGES.technical.title;
    this.actionMessage = ERROR_MESSAGES.technical.action;
  }
}
