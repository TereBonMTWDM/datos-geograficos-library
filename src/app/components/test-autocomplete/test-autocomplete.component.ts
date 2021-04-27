import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  ValidatorFn,
  AbstractControl,
  Validators
} from "@angular/forms";
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatosGeograficosService } from 'projects/datos-geograficos/src/lib/datos-geograficos.service';


export interface User {
  name: string;
}

@Component({
  selector: 'app-test-autocomplete',
  templateUrl: './test-autocomplete.component.html',
  styles: []
})
export class TestAutocompleteComponent implements OnInit {

  // options: User[] = [
  //   { name: "Mary" },
  //   { name: "Shelley" },
  //   { name: "Frankstein" },
  //   { name: "Shierley" },
  //   { name: "Igor" }
  // ];
  options: any[];
  // myControl = new FormControl(null, [
  //   Validators.required,
  //   forbiddenNamesValidator(this.options)
  // ]);
  myControl = new FormControl();
  filteredOptions: Observable<User[]>;

  constructor(
    private geograficosSvc: DatosGeograficosService
  ) { }
  
  ngOnInit() {

    this.getData();

    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith<string | User>(""),
    //   map(value => (typeof value === "string" ? value : value.name)),
    //   map(name => (name ? this._filter(name) : this.options.slice()))
    // );
  }


  getData() {

    this.geograficosSvc.get('Estado').subscribe((result:any) => {
      this.options = result;
      console.log(this.options);
      this.myControl = new FormControl(null, [
        Validators.required,
        forbiddenNamesValidator(this.options)
      ]);


      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith<string | User>(""),
        map(value => (typeof value === "string" ? value : value.name)),
        map(name => (name ? this._filter(name) : this.options.slice()))
      );
    });

  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(
      option => option.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

}


export function forbiddenNamesValidator(Services: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const index = Services.findIndex(Service => {
      return new RegExp("^" + Service.nombre + "$").test(control.value);
    });
    return index < 0 ? { forbiddenNames: { value: control.value } } : null;
  };
}
