import { TestBed, inject } from '@angular/core/testing';

import { InitGuardService } from './init-guard.service';

describe('InitGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitGuardService]
    });
  });

  it('should be created', inject([InitGuardService], (service: InitGuardService) => {
    expect(service).toBeTruthy();
  }));
});
