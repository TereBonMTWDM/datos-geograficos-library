import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenUploadComponent } from './imagen-upload.component';

describe('ImagenUploadComponent', () => {
  let component: ImagenUploadComponent;
  let fixture: ComponentFixture<ImagenUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagenUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagenUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
