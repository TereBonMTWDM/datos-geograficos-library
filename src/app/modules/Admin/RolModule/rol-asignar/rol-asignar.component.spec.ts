import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolAsignarComponent } from './rol-asignar.component';

describe('RolAsignarComponent', () => {
  let component: RolAsignarComponent;
  let fixture: ComponentFixture<RolAsignarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolAsignarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolAsignarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
