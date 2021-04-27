import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolAsignadosComponent } from './rol-asignados.component';

describe('RolAsignadosComponent', () => {
  let component: RolAsignadosComponent;
  let fixture: ComponentFixture<RolAsignadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolAsignadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolAsignadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
