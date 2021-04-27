import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[dgtitGeoAppSoloNumeros]'
})
export class AppSoloNumerosDirective {

  private decimalCounter = 0;
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];
  @Input() decimal ?= false;
  inputElement: HTMLElement;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Permite: teclas de navegacion: backspace, suprimir, flechas etc.
      (e.key === 'a' && e.ctrlKey === true) || // Permite: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Permite: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Permite: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Permite: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Permite: Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Permite: Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Permite: Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) || // Permite: Cmd+X (Mac)
      (this.decimal && e.key === '.' && this.decimalCounter < 1) // Permite: solo un punto decimal
    ) {
      // Introdugo un digito valido
      return;
    }
    // Asegurarse que es un numero y detener el evento keypress
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (!this.decimal) {
      return;
    } else {
      this.decimalCounter = this.el.nativeElement.value.split('.').length - 1;
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData.getData('text/plain');

    if (!this.decimal) {
      document.execCommand(
        'insertText',
        false,
        pastedInput.replace(/[^0-9]/g, '')
      );
    } else if (this.isValidDecimal(pastedInput)) {
      document.execCommand(
        'insertText',
        false,
        pastedInput.replace(/[^0-9.]/g, '')
      );
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text');
    this.inputElement.focus();

    if (!this.decimal) {
      document.execCommand(
        'insertText',
        false,
        textData.replace(/[^0-9]/g, '')
      );
    } else if (this.isValidDecimal(textData)) {
      document.execCommand(
        'insertText',
        false,
        textData.replace(/[^0-9.]/g, '')
      );
    }
  }

  isValidDecimal(str: string): boolean {
    return str.split('.').length <= 2;
  }
}
