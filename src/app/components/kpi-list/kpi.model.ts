export interface KpiList {
  readonly title: string;
  readonly kpis: Kpi[];
}

export interface Kpi {
  readonly label: string;
  readonly value: number;
}
