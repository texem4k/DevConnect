import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import { IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  imports: [
    RouterLink, IonList, IonItem, IonLabel
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
