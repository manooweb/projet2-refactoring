import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic, Participation } from 'src/app/models/olympic.model';


@Component({
    selector: 'app-country-detail',
    templateUrl: './country-detail.component.html',
    styleUrls: ['./country-detail.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class CountryDetailComponent implements OnInit {
  private olympicUrl = './assets/mock/olympic.json';
  public lineChart!: Chart<"line", number[], number>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
  }

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.http.get<Olympic[]>(this.olympicUrl).pipe().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((i: Olympic) => i.country === countryName);
          this.titlePage = selectedCountry?.country ?? '';
          const participations = selectedCountry?.participations.map((i: Participation) => i);
          this.totalEntries = participations?.length ?? 0;
          const years = selectedCountry?.participations.map(i => i.year) ?? [];
          const medals = selectedCountry?.participations.map(i => i.medalsCount) ?? [];
          this.totalMedals = medals.reduce((accumulator, item) => accumulator + item, 0);
          const nbAthletes = selectedCountry?.participations.map(i => i.athleteCount) ?? []
          this.totalAthletes = nbAthletes.reduce((accumulator, item) => accumulator + item, 0);
          this.buildChart(years, medals);
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message
      }
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
