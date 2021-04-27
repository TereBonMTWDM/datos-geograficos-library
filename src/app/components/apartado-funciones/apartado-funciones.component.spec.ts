import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartadoFuncionesComponent } from './apartado-funciones.component';

describe('ApartadoFuncionesComponent', () => {
  let component: ApartadoFuncionesComponent;
  let fixture: ComponentFixture<ApartadoFuncionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartadoFuncionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartadoFuncionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
