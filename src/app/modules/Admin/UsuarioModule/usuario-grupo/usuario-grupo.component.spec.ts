import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioGrupoComponent } from './usuario-grupo.component';

describe('UsuarioGrupoComponent', () => {
  let component: UsuarioGrupoComponent;
  let fixture: ComponentFixture<UsuarioGrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
