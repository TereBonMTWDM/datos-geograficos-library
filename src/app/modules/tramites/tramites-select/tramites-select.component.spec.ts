import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesSelectComponent } from './tramites-select.component';

describe('TramitesSelectComponent', () => {
  let component: TramitesSelectComponent;
  let fixture: ComponentFixture<TramitesSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TramitesSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
