import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosActionsComponent } from './usuarios-actions.component';

describe('UsuariosActionsComponent', () => {
  let component: UsuariosActionsComponent;
  let fixture: ComponentFixture<UsuariosActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
