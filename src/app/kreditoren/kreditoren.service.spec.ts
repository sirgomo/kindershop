import { TestBed } from '@angular/core/testing';

import { KreditorenService } from './kreditoren.service';

describe('KreditorenService', () => {
  let service: KreditorenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KreditorenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
