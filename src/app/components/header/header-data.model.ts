export interface HeaderData {
  readonly title: string;
  readonly kpis?: HeaderKpi[];
}

export interface HeaderKpi {
  readonly label: string;
  readonly value: number;
}
