import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMenusComponent } from './listado-menus.component';

describe('ListadoMenusComponent', () => {
  let component: ListadoMenusComponent;
  let fixture: ComponentFixture<ListadoMenusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoMenusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
