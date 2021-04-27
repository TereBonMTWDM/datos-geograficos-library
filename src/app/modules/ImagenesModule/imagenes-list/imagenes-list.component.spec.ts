import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenesListComponent } from './imagenes-list.component';

describe('ImagenesListComponent', () => {
  let component: ImagenesListComponent;
  let fixture: ComponentFixture<ImagenesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagenesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagenesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
