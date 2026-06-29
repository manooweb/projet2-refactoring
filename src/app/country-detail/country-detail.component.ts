import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { KpiList } from '../components/kpi-list/kpi.model';
import { BackButtonComponent } from "../components/back-button/back-button.component";
import { MedalChartComponent } from "../components/medal-chart/medal-chart.component";
import { MedalChartService } from '../services/medal-chart.service';


@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    HeaderComponent,
    BackButtonComponent,
    MedalChartComponent
]
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(DataService);
  private readonly medalChartService = inject(MedalChartService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  kpiList$!: Observable<KpiList>;
  chartId = 'countryChart';
  chart!: Chart;
  error!: string;

  ngOnInit() {
    const countryName = this.route.snapshot.params['countryName'];

    const selectedCountry$ = this.dataService.getCountryByName(countryName).pipe(
      tap((selectedCountry: Olympic | undefined) => {
        if (!selectedCountry) {
          this.router.navigate(['/not-found'],{ queryParams: { errorMessage: `Country "${countryName}" not found` }});
          return;
        }
        const participationYears = selectedCountry.participations.map(participation => participation.year) ?? [];
        const medalCounts = selectedCountry.participations.map(participation => participation.medalsCount) ?? [];
        const chartData: ChartConfiguration = this.buildChartData(participationYears, medalCounts);
        this.chart?.destroy();
        this.chart = this.medalChartService.createChart(
          this.chartId,
          chartData
        );
      }),
      catchError((error: HttpErrorResponse) => {
        this.error = error.message;
        return of(undefined);
      }),
      shareReplay(1)
    );

    this.kpiList$ = selectedCountry$.pipe(
      map((selectedCountry: Olympic | undefined) => {

        return {
          title: selectedCountry?.country ?? countryName,
          kpis: [
            {
              label: 'Number of entries',
              value: selectedCountry?.participations.length ?? 0
            },
            {
              label: 'Number of medals',
              value: selectedCountry?.participations.reduce((total, participation) => total + participation.medalsCount, 0) ?? 0
            },
            {
              label: 'Number of athletes',
              value: selectedCountry?.participations.reduce((total, participation) => total + participation.athleteCount, 0) ?? 0
            }
          ]
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private buildChartData(participationYears: number[], medalCounts: number[]): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: participationYears,
        datasets: [
          {
            label: "Medals",
            data: medalCounts,
            backgroundColor: '#0b868f'
          },
        ]
      },
    };
  }
}
