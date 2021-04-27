import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccesibilidadService {
  public criteriaTags: string[]
  public isActive: boolean
  public isZoomed: boolean

  constructor() {
    this.isActive, this.isZoomed = false
  }

  textToVoice(e: MouseEvent): void {
    let msg = new SpeechSynthesisUtterance()
    msg.rate = 1.4
    msg.volume = 1
    msg.pitch = 0.5
    msg.voice = speechSynthesis.getVoices()[0]
    if (!(['LI', 'LABEL', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'DIV'].includes((<HTMLElement>e.target).tagName)) || (<HTMLElement>e.target).title === "") return
    msg.text = (<HTMLElement>e.target).title
    speechSynthesis.cancel()
    speechSynthesis.speak(msg)
  }

  activateScreenReader(): void {
    (<HTMLBodyElement>document.body).addEventListener('mouseover', this.textToVoice)
    this.isActive = true
  }

  deactivateScreenReader(): void {
    (<HTMLBodyElement>document.body).removeEventListener('mouseover', this.textToVoice)
    this.isActive = false
  }

  toogleZoom(): void {
    !this.isZoomed ? (document.body.classList.add('zoom'), this.isZoomed = true) : (document.body.classList.remove('zoom'), this.isZoomed = false)
  }
}
