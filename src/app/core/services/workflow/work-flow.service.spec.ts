import { TestBed } from '@angular/core/testing';

import { WorkFlowService } from './work-flow.service';

describe('WorkFlowService', () => {
  let service: WorkFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
