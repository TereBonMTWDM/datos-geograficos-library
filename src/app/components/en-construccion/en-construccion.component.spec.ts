import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnConstruccionComponent } from './en-construccion.component';

describe('EnConstruccionComponent', () => {
  let component: EnConstruccionComponent;
  let fixture: ComponentFixture<EnConstruccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnConstruccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnConstruccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
