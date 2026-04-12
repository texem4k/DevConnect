import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {
  @Input() tituloCompleto: string = ''
  tituloMostrado: string = ''

  ngOnInit() {
    this.animarTexto()
  }

  private animarTexto() {
    let i = 0
    const intervalo = setInterval(() => {
      this.tituloMostrado += this.tituloCompleto[i]
      i++
      if (i >= this.tituloCompleto.length) {
        clearInterval(intervalo)
      }
    }, 150)
  }
}
