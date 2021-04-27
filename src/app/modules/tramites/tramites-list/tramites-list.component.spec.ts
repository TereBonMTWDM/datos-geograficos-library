import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesListComponent } from './tramites-list.component';

describe('TramitesListComponent', () => {
  let component: TramitesListComponent;
  let fixture: ComponentFixture<TramitesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TramitesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
