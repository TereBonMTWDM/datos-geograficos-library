import { FormElement } from '../../formElement.model';

export class FileBox extends FormElement<string> {
  controlType = 'input';
  type: string;
  accept: string;


  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
    this.accept = options['accept'] || '';
  }
}