import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenesModuleComponent } from './imagenes-module.component';

describe('ImagenesModuleComponent', () => {
  let component: ImagenesModuleComponent;
  let fixture: ComponentFixture<ImagenesModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagenesModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagenesModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
