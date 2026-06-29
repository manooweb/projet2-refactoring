import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { KpiList } from '../kpi-list/kpi.model';
import { KpiListComponent } from "../kpi-list/kpi-list.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    KpiListComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() kpiList?: KpiList;
  @Input() error?: string;

}
