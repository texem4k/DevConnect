import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-topic-box-btn',
  imports: [],
  templateUrl: './topic-box-btn.html',
  styleUrl: './topic-box-btn.css',
})
export class TopicBoxBtn {
  @Input() topic: string = ''
}
