import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusActionsComponent } from './menus-actions.component';

describe('MenusActionsComponent', () => {
  let component: MenusActionsComponent;
  let fixture: ComponentFixture<MenusActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenusActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenusActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
