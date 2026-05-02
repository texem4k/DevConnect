import {Component} from '@angular/core';
import {Footer} from '../../shared/components/footer/footer';
import {Banner} from '../../shared/components/banner/banner';
import {Header} from '../../shared/components/header/header';

@Component({
  selector: 'app-about-us',
  imports: [
    Footer,
    Banner,
    Header,
  ],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs{
}
