import { Component, Input } from '@angular/core';
import { Kpi } from '../kpi-list/kpi.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  @Input() kpi?: Kpi;
}
