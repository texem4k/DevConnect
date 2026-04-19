import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner implements OnInit {
  tituloCompleto: string = 'DevConnect';   // ← valor por defecto directo
  tituloMostrado: string = '';
  isLoading: Boolean = true;

  constructor(private ngZone: NgZone,private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.animarTexto();
  }

  private animarTexto() {
    let i = 0;
    this.tituloMostrado = '';
    this.ngZone.run(() => {
      const intervalo = setInterval(() => {
        this.tituloMostrado += this.tituloCompleto[i];
        i++;
        if (i >= this.tituloCompleto.length) {
          clearInterval(intervalo);
        }
      }, 150);
    });
    this.isLoading = false;
    this.cd.detectChanges();
  }
}
