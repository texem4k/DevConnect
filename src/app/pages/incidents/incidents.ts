import { Component } from '@angular/core';
import {Header} from '../../shared/components/header/header';
import {Footer} from '../../shared/components/footer/footer';

@Component({
  selector: 'app-incidents',
  imports: [
    Header,
    Footer
  ],
  templateUrl: './incidents.html',
  styleUrl: './incidents.css',
})
export class Incidents {}
