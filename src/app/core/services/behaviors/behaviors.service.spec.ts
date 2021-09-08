import { TestBed } from '@angular/core/testing';

import { BehaviorsService } from './behaviors.service';

describe('BehaviorsService', () => {
  let service: BehaviorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BehaviorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
