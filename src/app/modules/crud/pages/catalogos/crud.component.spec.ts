import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Resource } from 'src/app/models/catalogo/resource.model';
import { ResourseService } from 'src/app/services/catalogos/resourceService/resourse.service';
import { NotifierService } from 'angular-notifier';

import { CrudComponent } from './crud.component';

describe('CrudComponent', () => {
  let component: CrudComponent;
  let fixture: ComponentFixture<CrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
