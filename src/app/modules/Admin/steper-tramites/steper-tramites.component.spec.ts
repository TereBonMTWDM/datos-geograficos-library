import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SteperTramitesComponent } from './steper-tramites.component';

describe('SteperTramitesComponent', () => {
  let component: SteperTramitesComponent;
  let fixture: ComponentFixture<SteperTramitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SteperTramitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SteperTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
