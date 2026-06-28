import { Component, Input } from '@angular/core';
import { KpiList } from './kpi.model';
import { KpiCardComponent } from '../kpi-card/kpi-card.component';

@Component({
  selector: 'app-kpi-list',
  standalone: true,
  imports: [KpiCardComponent],
  templateUrl: './kpi-list.component.html',
  styleUrl: './kpi-list.component.scss'
})
export class KpiListComponent {
  @Input() kpiList?: KpiList;
}
