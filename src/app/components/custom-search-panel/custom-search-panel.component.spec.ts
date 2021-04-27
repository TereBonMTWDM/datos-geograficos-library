import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSearchPanelComponent } from './custom-search-panel.component';

describe('CustomSearchPanelComponent', () => {
  let component: CustomSearchPanelComponent;
  let fixture: ComponentFixture<CustomSearchPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSearchPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
