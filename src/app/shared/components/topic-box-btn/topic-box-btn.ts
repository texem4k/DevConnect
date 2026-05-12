import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonChip, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-topic-box-btn',
  imports: [IonChip, IonLabel],
  templateUrl: './topic-box-btn.html',
  styleUrl: './topic-box-btn.css',
})
export class TopicBoxBtn {
  @Input() topic: string = '';
  @Input() id: string = '';

  constructor(private router: Router) {}

  navegarAResultados() {
    this.router.navigate(['/SearchResult'], {
      queryParams: { topic: this.topic }
    });
  }
}
