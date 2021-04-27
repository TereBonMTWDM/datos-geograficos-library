import { TestBed } from '@angular/core/testing';

import { GeograficosService } from './geograficos.service';

describe('GeograficosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeograficosService = TestBed.get(GeograficosService);
    expect(service).toBeTruthy();
  });
});
