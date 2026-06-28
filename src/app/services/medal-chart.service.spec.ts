import { TestBed } from '@angular/core/testing';

import { MedalChartService } from './medal-chart.service';

describe('MedalChartService', () => {
  let service: MedalChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedalChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
