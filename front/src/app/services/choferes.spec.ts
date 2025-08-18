import { TestBed } from '@angular/core/testing';

import { Choferes } from './choferes';

describe('Choferes', () => {
  let service: Choferes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Choferes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
