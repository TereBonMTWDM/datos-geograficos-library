import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioModuleComponent } from './usuario-module.component';

describe('UsuarioModuleComponent', () => {
  let component: UsuarioModuleComponent;
  let fixture: ComponentFixture<UsuarioModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
