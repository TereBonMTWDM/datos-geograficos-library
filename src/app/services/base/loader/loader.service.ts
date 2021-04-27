import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loader: any = document.createElement('div')
  isShowing: boolean = false

  constructor() {
  }

  showLoader = () => (
    !this.isShowing ?
      (this.createLoader(),
        this.loader.classList.add('loader-background'),
        this.appendElement(document.body)(this.loader),
        this.isShowing = true) :
      console.log('El loader ya se está mostrando')
  )

  closeLoader = () => this.isShowing ? (this.removeElement(document.body)(this.loader), this.isShowing = false) : console.log('No hay loader por cerrar')

  createLoader = () => this.loader.innerHTML = `<div class="lds-ripple"><div></div><div></div><div>`

  createElement = (tag: string) => document.createElement(tag)

  appendElement = (parentElement: HTMLElement) => (childElement: HTMLElement) => parentElement.appendChild(childElement)

  removeElement = (parentElement: HTMLElement) => (childElement: HTMLElement) => parentElement.removeChild(childElement)
}
