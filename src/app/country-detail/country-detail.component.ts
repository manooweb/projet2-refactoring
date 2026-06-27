import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
  standalone: true,
  imports: [AsyncPipe, RouterLink]
})
export class CountryDetailComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly route = inject(ActivatedRoute);

  private olympics$!: Observable<Olympic[]>;
  lineChart!: Chart<"line", number[], number>;
  error!: string;
  titlePage$!: Observable<string>;
  totalEntries$!: Observable<number>;
  totalMedals$!: Observable<number>;
  totalAthletes$!: Observable<number>;

  ngOnInit() {
    const countryName = this.route.snapshot.params['countryName'];
    this.olympics$ = this.dataService.getAllOlympics().pipe(
      tap((olympics: Olympic[]) => {
        if (olympics.length > 0) {
          const selectedCountry = this.findCountryByName(olympics, countryName);
          const years = selectedCountry?.participations.map(i => i.year) ?? [];
          const medals = selectedCountry?.participations.map(i => i.medalsCount) ?? [];
          this.buildChart(years, medals);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.error = error.message;
        return of([]);
      }),
      shareReplay(1)
    );

    this.titlePage$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const selectedCountry = this.findCountryByName(olympics, countryName);
        return selectedCountry?.country ?? '';
      })
    );

    this.totalEntries$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const selectedCountry = this.findCountryByName(olympics, countryName);
        return selectedCountry?.participations.length ?? 0;
      })
    );

    this.totalMedals$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const selectedCountry = this.findCountryByName(olympics, countryName);
        const medals = selectedCountry?.participations.map(i => i.medalsCount) ?? [];
        return medals.reduce((accumulator, item) => accumulator + item, 0);
      })
    );

    this.totalAthletes$ = this.olympics$.pipe(
      map((olympics: Olympic[]) => {
        const selectedCountry = this.findCountryByName(olympics, countryName);
        const nbAthletes = selectedCountry?.participations.map(i => i.athleteCount) ?? [];
        return nbAthletes.reduce((accumulator, item) => accumulator + item, 0);
      })
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

  private findCountryByName(olympics: Olympic[], countryName: string): Olympic | undefined {
    return olympics.find((i: Olympic) => i.country === countryName);
  }
}
