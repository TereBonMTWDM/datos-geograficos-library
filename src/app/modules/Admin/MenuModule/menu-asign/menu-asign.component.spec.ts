import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAsignComponent } from './menu-asign.component';

describe('MenuAsignComponent', () => {
  let component: MenuAsignComponent;
  let fixture: ComponentFixture<MenuAsignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuAsignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
