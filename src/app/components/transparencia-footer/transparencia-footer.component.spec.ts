import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparenciaFooterComponent } from './transparencia-footer.component';

describe('TransparenciaFooterComponent', () => {
  let component: TransparenciaFooterComponent;
  let fixture: ComponentFixture<TransparenciaFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransparenciaFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransparenciaFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
