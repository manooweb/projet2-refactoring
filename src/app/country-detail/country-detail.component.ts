import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { HeaderData } from '../components/header/header-data.model';


@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    HeaderComponent
  ]
})
export class CountryDetailComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly route = inject(ActivatedRoute);

  private olympics$!: Observable<Olympic[]>;
  headerData!: HeaderData;
  lineChart!: Chart<"line", number[], number>;
  error!: string;
  totalEntries$!: Observable<number>;
  totalMedals$!: Observable<number>;
  totalAthletes$!: Observable<number>;

  ngOnInit() {
    const countryName = this.route.snapshot.params['countryName'];
    this.headerData = {
      title: countryName
    };

    const selectedCountry$ = this.dataService.getCountryByName(countryName).pipe(
      tap((selectedCountry: Olympic | undefined) => {
        if (selectedCountry) {
          const years = selectedCountry.participations.map(i => i.year) ?? [];
          const medals = selectedCountry.participations.map(i => i.medalsCount) ?? [];
          this.buildChart(years, medals);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.error = error.message;
        return of(undefined);
      }),
      shareReplay(1)
    );

    this.totalEntries$ = selectedCountry$.pipe(
      map((selectedCountry: Olympic | undefined) => selectedCountry?.participations.length ?? 0)
    );

    this.totalMedals$ = selectedCountry$.pipe(
      map((selectedCountry: Olympic | undefined) => selectedCountry?.participations.reduce((total, participation) => total + participation.medalsCount, 0) ?? 0)
    );

    this.totalAthletes$ = selectedCountry$.pipe(
      map((selectedCountry: Olympic | undefined) => selectedCountry?.participations.reduce((total, participation) => total + participation.athleteCount, 0) ?? 0)
    );
  }

  buildChart(years: number[], medals: number[]) {
    const lineChart = new Chart("countryChart", {
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
      options: {
        aspectRatio: 2.5
      }
    });
    this.lineChart = lineChart;
  }
}
