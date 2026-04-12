import {Component, Input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-banner-profile',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './banner-profile.html',
  styleUrl: './banner-profile.css',
})
export class BannerProfile {
  @Input() avatar: string = ''
  @Input() banner: string = ''
  @Input() titulo: string = ''
}
