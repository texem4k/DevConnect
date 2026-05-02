import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-banner-profile',
  imports: [

  ],
  templateUrl: './banner-profile.html',
  styleUrl: './banner-profile.css',
})
export class BannerProfile {
  @Input() avatar: string = ''
  @Input() banner: string = ''
  @Input() titulo: string = ''
}
