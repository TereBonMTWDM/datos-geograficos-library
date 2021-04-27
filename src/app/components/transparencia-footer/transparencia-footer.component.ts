import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dgtit-transparencia-footer',
  templateUrl: './transparencia-footer.component.html',
  styleUrls: ['./transparencia-footer.component.scss']
})
export class TransparenciaFooterComponent implements OnInit {

  enlacesFooter = [
    {
      link: "https://transparencia.guanajuato.gob.mx/transparencia/informacion_publica_directorio.php",
      title: "Directorio"
    },
    {
      link: "https://transparencia.guanajuato.gob.mx/transparencia/informacion_publica_estructura.php",
      title: "Estructura orgánica"
    },
    {
      link: "http://finanzas.guanajuato.gob.mx/mapa.php?id=95",
      title: "Monitoreo y evaluación"
    },
    {
      link: "https://transparencia.guanajuato.gob.mx/transparencia/informacion_publica_tabulador.php",
      title: "Tabulador de sueldos"
    },
    {
      link: "https://strc.guanajuato.gob.mx/auditoriaspracticadas/",
      title: "Auditorías"
    },
    {
      link: "http://finanzas.guanajuato.gob.mx/c_aviso/index.php",
      title: "Aviso de privacidad"
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
