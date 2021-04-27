import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolModuleComponent } from './rol-module.component';

describe('RolModuleComponent', () => {
  let component: RolModuleComponent;
  let fixture: ComponentFixture<RolModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
