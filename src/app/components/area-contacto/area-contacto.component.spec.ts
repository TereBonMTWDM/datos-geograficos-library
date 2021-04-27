import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaContactoComponent } from './area-contacto.component';

describe('AreaContactoComponent', () => {
  let component: AreaContactoComponent;
  let fixture: ComponentFixture<AreaContactoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaContactoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
