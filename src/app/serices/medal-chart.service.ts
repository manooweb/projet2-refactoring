import { Injectable } from '@angular/core';
import Chart, { ChartConfiguration, ChartEvent } from 'chart.js/auto';

@Injectable({
  providedIn: 'root'
})
export class MedalChartService {

  createChart(chartId: string, chartData: ChartConfiguration, onClick?: (countryName: string) => void): Chart {

    const chart = new Chart(chartId, {
      ...chartData,
      options: {
        ...chartData.options,
        responsive: true,
      }
    });


    if (onClick) {
      chart.options.onClick = (event: ChartEvent) => {
        if (!event.native) {
          return;
        }
        const points = chart.getElementsAtEventForMode(event.native, 'point', { intersect: true }, true)
        if (!points.length) {
          return;
        }
        const firstPoint = points[0];
        const countryName = chart.data.labels?.[firstPoint.index];
        if (typeof countryName === 'string') {
          onClick(countryName);
        }
      }
    }
    return chart;
  };

}
