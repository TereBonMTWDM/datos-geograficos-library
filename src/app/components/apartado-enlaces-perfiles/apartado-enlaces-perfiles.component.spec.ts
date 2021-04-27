import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartadoEnlacesPerfilesComponent } from './apartado-enlaces-perfiles.component';

describe('ApartadoEnlacesPerfilesComponent', () => {
  let component: ApartadoEnlacesPerfilesComponent;
  let fixture: ComponentFixture<ApartadoEnlacesPerfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApartadoEnlacesPerfilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApartadoEnlacesPerfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
