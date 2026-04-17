import { Component } from '@angular/core';
import {Header} from '../../shared/components/header/header';
import {Footer} from '../../shared/components/footer/footer';

@Component({
  selector: 'app-index',
  imports: [
    Header,
    Footer,
  ],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index {}
