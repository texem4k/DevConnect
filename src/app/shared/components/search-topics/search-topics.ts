import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../../../core/services/topic-crud';
import { Topic } from '../../../core/models/topic.model';
import { IonSearchbar, IonList, IonItem, IonCheckbox, IonLabel, IonBadge, IonButton, IonChip, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-topics',
  standalone: true,
  imports: [CommonModule, FormsModule, IonSearchbar, IonList, IonItem, IonCheckbox, IonLabel, IonBadge, IonButton, IonChip, IonIcon],
  templateUrl: './search-topics.html',
  styleUrls: ['./search-topics.css'],
})
export class SearchTopicsComponent implements OnInit {
  @Input() topicsUrl = '../../../../../public/topics.json';
  @Input() preselectedIds: string[] = [];

  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() allTopics = new EventEmitter<Topic[]>();

  options: Topic[] = [];
  selected = new Set<string>();
  query = '';
  isOpen = false;

  constructor(
    private elRef: ElementRef,
    private loadTopic: TopicService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTopic.getTopics().subscribe(topics => {
      this.options = topics ?? [];
      this.allTopics.emit([...this.options]);

      if (this.preselectedIds.length) {
        this.selected = new Set(this.preselectedIds);
        this.sendSelectedOptions();
      }
      this.cdr.detectChanges();
    });
  }

  get filteredOptions(): Topic[] {
    const q = this.query.toLowerCase();
    if (!q) return this.options;
    return this.options.filter(
      (o) =>
        o.name.toLowerCase().includes(q) || o.cat.toLowerCase().includes(q)
    );
  }

  get selectedItems(): Topic[] {
    return this.options.filter((o) => this.selected.has(o.id));
  }

  get selectedCount(): number {
    return this.selected.size;
  }

  openDropdown(): void {
    this.isOpen = true;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    setTimeout(() => {
      if (!this.elRef.nativeElement.contains(event.target)) {
        this.closeDropdown();
      }
    }, 0);
  }

  toggleOption(event: MouseEvent, id: string): void {
    event.stopPropagation();
    const next = new Set(this.selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.selected = next;
    this.sendSelectedOptions();
  }

  removeTag(id: string): void {
    const next = new Set(this.selected);
    next.delete(id);
    this.selected = next;
    this.sendSelectedOptions();
  }

  clearAll(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.selected = new Set();
    this.sendSelectedOptions();
  }

  isSelected(id: string): boolean {
    return this.selected.has(id);
  }

  sendSelectedOptions(): void {
    this.selectionChange.emit([...this.selected]);
  }

  sendTopics(): void {
    this.allTopics.emit([...this.options]);
  }

  highlight(text: string): string {
    const q = this.query;
    if (!q) return text;
    const re = new RegExp(`(${q})`, 'gi');
    return text.replace(
      re,
      '<mark style="background:var(--accent-dim);color:var(--accent);border-radius:2px;">$1</mark>'
    );
  }
}
