import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { HeaderTopicsService } from '../../../core/services/header-topics.service';
import { UserService } from '../../../core/services/user.service';
import { UserProfile } from '../models/header.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class Header implements OnInit {
  private topicsSvc = inject(HeaderTopicsService);
  private userSvc   = inject(UserService);
  private router    = inject(Router);
  private elRef     = inject(ElementRef);

  // ── Data desde Firestore ──────────────────────────────────────────────
  topicsMap = toSignal(this.topicsSvc.getAsMap(), { initialValue: {} });
  topicEntries = computed(() => Object.entries(this.topicsMap()));

  // ── Sesión ────────────────────────────────────────────────────────────
  loggedUserId = this.userSvc.loggedUserId;
  userProfile  = signal<UserProfile | null>(null);

  // ── UI state ─────────────────────────────────────────────────────────
  sidebarOpen      = signal(false);
  profileDdOpen    = signal(false);
  searchQuery      = signal('');

  ngOnInit(): void {
    const uid = this.loggedUserId();
    if (uid) {
      this.userSvc.getById(uid).subscribe(u => this.userProfile.set(u));
    }
  }

  // ── Sidebar ───────────────────────────────────────────────────────────
  openSidebar()  { this.sidebarOpen.set(true);  document.body.style.overflow = 'hidden'; }
  closeSidebar() { this.sidebarOpen.set(false); document.body.style.overflow = ''; }

  @HostListener('window:resize')
  onResize() { if (window.innerWidth > 768) this.closeSidebar(); }

  @HostListener('window:keydown.escape')
  onEscape() { this.closeSidebar(); this.profileDdOpen.set(false); }

  // ── Profile dropdown ──────────────────────────────────────────────────
  toggleProfileDd(e: Event) {
    e.stopPropagation();
    this.profileDdOpen.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    if (!this.elRef.nativeElement.contains(e.target)) {
      this.profileDdOpen.set(false);
    }
  }

  // ── Búsqueda ──────────────────────────────────────────────────────────
  submitSearch() {
    const q = this.searchQuery().trim();
    if (q) this.router.navigate(['/search'], { queryParams: { topic: q } });
  }

  navigateToTopic(topic: string) {
    this.router.navigate(['/search'], { queryParams: { topic } });
    this.closeSidebar();
  }

  // ── Auth ─────────────────────────────────────────────────────────────
  logout() { this.userSvc.logout(); }
}
