import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-medal-chart',
  standalone: true,
  imports: [],
  templateUrl: './medal-chart.component.html',
  styleUrl: './medal-chart.component.scss'
})
export class MedalChartComponent {
  @Input() canvasId = '';
  @Input() label = '';
  @Input() chartType: 'pie' | 'line' = 'line';
  @Input() chartLegend?: string;

}
