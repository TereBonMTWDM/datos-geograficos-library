import { TestBed } from '@angular/core/testing';

import { TramitesService } from './tramites.service';

describe('TramitesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TramitesService = TestBed.get(TramitesService);
    expect(service).toBeTruthy();
  });
});
