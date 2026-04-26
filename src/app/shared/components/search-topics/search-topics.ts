import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {DataLoader} from '../../services/get-data-service';
import {Topic} from '../../services/Topic';


@Component({
  selector: 'app-search-topics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-topics.html',
  styleUrls: ['./search-topics.css'],
})
export class SearchTopicsComponent implements OnInit {
  @Input() topicsUrl = '../../../../../public/topics.json';

  @Input() preselectedIds: number[] = [];

  @Output() selectionChange = new EventEmitter<number[]>();
  @Output() allTopics = new EventEmitter<Topic[]>();

  options: Topic[] = [];
  selected = new Set<number>();
  query = '';
  isOpen = false;

  constructor(
    private elRef: ElementRef,
    private loader: DataLoader,
  ) {}


  ngOnInit(): void {
    this.loader.loadData(
      { loadTopics: true},

      (data) => {
        this.options    = data.topicsData    ?? [];
      }
    );
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
    return this.options.filter((o) => this.selected.has(Number(o.id)));
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


  toggleOption(event: MouseEvent, id: number): void {
    event.stopPropagation();
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.add(id);
    }
    this.sendSelectedOptions();
  }

  removeTag(id: number): void {
    this.selected.delete(id);
    this.sendSelectedOptions();
  }

  clearAll(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.selected.clear();
    this.sendSelectedOptions();
  }

  isSelected(id: number): boolean {
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

  protected readonly Number = Number;
}
