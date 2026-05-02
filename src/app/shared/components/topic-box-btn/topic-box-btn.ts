import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topic-box-btn',
  imports: [],
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
