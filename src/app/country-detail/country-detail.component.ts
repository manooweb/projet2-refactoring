import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { KpiList } from '../components/kpi-list/kpi.model';
import { BackButtonComponent } from "../components/back-button/back-button.component";
import { MedalChartComponent } from "../components/medal-chart/medal-chart.component";
import { MedalChartService } from '../serices/medal-chart.service';


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
  private readonly route = inject(ActivatedRoute);

  kpiList$!: Observable<KpiList>;
  chartId = 'countryChart';
  chart!: Chart;
  error!: string;

  ngOnInit() {
    const countryName = this.route.snapshot.params['countryName'];

    const selectedCountry$ = this.dataService.getCountryByName(countryName).pipe(
      tap((selectedCountry: Olympic | undefined) => {
        if (selectedCountry) {
          const years = selectedCountry.participations.map(i => i.year) ?? [];
          const medals = selectedCountry.participations.map(i => i.medalsCount) ?? [];
          const chartData: ChartConfiguration = this.buildChartData(years, medals);
          this.chart?.destroy();
          this.chart = this.medalChartService.createChart(
            this.chartId,
            chartData
          );
        }
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

  private buildChartData(years: number[], medals: number[]): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
    };
  }
}
