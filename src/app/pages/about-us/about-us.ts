import {Component} from '@angular/core';
import {Footer} from '../../shared/components/footer/footer';
import {Banner} from '../../shared/components/banner/banner';
import {Header} from '../../shared/components/header/header';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-us',
  imports: [
    Footer,
    Banner,
    Header,
    IonContent,
  ],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs{
}
