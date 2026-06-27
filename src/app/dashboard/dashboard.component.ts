import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Olympic } from 'src/app/models/olympic.model';
import { DataService } from '../services/data.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: true,
})
export class DashboardComponent implements OnInit {
  private readonly DataService = inject(DataService);
  public pieChart!: Chart<"pie", number[], string>;
  public totalCountries = 0
  public totalJOs = 0
  public error!:string
  titlePage = "Medals per Country";

  constructor(private router: Router, private http:HttpClient) { }

  ngOnInit() {
    this.DataService.getAllOlympics().pipe().subscribe(
      (data) => {
        console.log(`Liste des données : ${JSON.stringify(data)}`);
        if (data && data.length > 0) {
          this.totalJOs = Array.from(new Set(data.map((i: Olympic) => i.participations.map(f => f.year)).flat())).length;
          const countries: string[] = data.map((i: Olympic) => i.country);
          this.totalCountries = countries.length;
          const medals = data.map((i: Olympic) => i.participations.map(i => i.medalsCount));
          const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc, i) => acc + i, 0));
          this.buildPieChart(countries, sumOfAllMedalsYears);
        }
      },
      (error:HttpErrorResponse) => {
        console.log(`erreur : ${error}`);
        this.error = error.message
      }
    )
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

