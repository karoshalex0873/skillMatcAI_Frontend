import { TestBed } from '@angular/core/testing';

import { AiAccuracyService } from './ai-accuracy.service';

describe('AiAccuracyService', () => {
  let service: AiAccuracyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiAccuracyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
