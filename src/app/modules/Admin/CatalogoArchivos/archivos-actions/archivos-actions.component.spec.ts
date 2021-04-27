import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosActionsComponent } from './archivos-actions.component';

describe('ArchivosActionsComponent', () => {
  let component: ArchivosActionsComponent;
  let fixture: ComponentFixture<ArchivosActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivosActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
