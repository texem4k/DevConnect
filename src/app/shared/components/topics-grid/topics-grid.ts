import {Component, Input} from '@angular/core';
import {TopicBoxBtn} from '../topic-box-btn/topic-box-btn';
import {Topic} from '../../../core/models/topic.model';

@Component({
  selector: 'app-topics-grid',
  imports: [TopicBoxBtn],
  templateUrl: './topics-grid.html',
  styleUrl: './topics-grid.css',
})
export class TopicsGrid {
  @Input() title: string = ''
  @Input() items: Topic[] = []

  get topics() {
    return this.items
  }

  protected readonly top = top;
}
