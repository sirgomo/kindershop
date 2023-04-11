import { TestBed } from '@angular/core/testing';

import { ArtikelsService } from './artikels.service';

describe('ArtikelsService', () => {
  let service: ArtikelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtikelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
