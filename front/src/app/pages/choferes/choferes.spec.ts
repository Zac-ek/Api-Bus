import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Choferes } from './choferes';

describe('Choferes', () => {
  let component: Choferes;
  let fixture: ComponentFixture<Choferes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Choferes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Choferes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
