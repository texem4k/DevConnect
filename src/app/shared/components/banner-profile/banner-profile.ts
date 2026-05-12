import {Component, Input} from '@angular/core';
import { IonAvatar, IonImg } from '@ionic/angular/standalone';

@Component({
  selector: 'app-banner-profile',
  imports: [IonAvatar, IonImg],
  templateUrl: './banner-profile.html',
  styleUrl: './banner-profile.css',
})
export class BannerProfile {
  @Input() avatar: string = 'https://cdn-icons-png.flaticon.com/256/149/149071.png'
  @Input() banner: string = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fm=jpg&w=1600&h=400&fit=crop'
  @Input() titulo: string = ''
}
