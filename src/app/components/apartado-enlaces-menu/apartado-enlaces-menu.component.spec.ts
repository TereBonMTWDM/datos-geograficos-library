import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartadoEnlacesMenuComponent } from './apartado-enlaces-menu.component';

describe('ApartadoEnlacesMenuComponent', () => {
  let component: ApartadoEnlacesMenuComponent;
  let fixture: ComponentFixture<ApartadoEnlacesMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartadoEnlacesMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartadoEnlacesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
