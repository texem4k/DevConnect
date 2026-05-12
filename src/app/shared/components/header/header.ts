import { Component, HostListener, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderElementsService } from '../../../core/services/headerElements-service';
import { AuthService } from '../../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import {UserService} from '../../../core/services/user-crud';
import {firstValueFrom} from 'rxjs';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonImg, IonSearchbar, IonMenu, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  imports: [
    AsyncPipe,
    RouterModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonImg,
    IonSearchbar,
    IonMenu,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private headerService = inject(HeaderElementsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);

  isLoggedIn = false;
  userPhoto = '';
  currentUserId = '';
  isProfileMenuOpen = false;
  searchQuery = '';
  topicos$ = this.headerService.getTopics();

  private activeMenuIndex: number | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private isPointerOnTrigger = false;
  private isPointerOnPanel = false;

  buildQueryParams(key: string, value: string): Record<string, string> {
    return { [key]: value };
  }

   ngOnInit() {
    this.authService.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
    });

    this.authService.currentUser$.subscribe(async user => {
      this.userPhoto = await this.getPhotoUser();

      this.currentUserId = user?.uid ?? '';
    });
  }

  async getPhotoUser(): Promise<string> {
    const uid = this.authService.currentUserSubject.value?.uid;
    if (!uid) {
      return 'https://cdn-icons-png.flaticon.com/256/149/149071.png';
    }
    const user = await firstValueFrom(this.userService.getUserById(uid));
    return user?.Avatar ?? 'https://cdn-icons-png.flaticon.com/256/149/149071.png';
  }

  onMenuEnter(index: number) {
    this.isPointerOnTrigger = true;
    this.clearCloseTimer();
    this.activeMenuIndex = index;
  }

  onMenuLeave() {
    this.isPointerOnTrigger = false;
    this.scheduleClose();
  }

  onPanelEnter(index: number) {
    this.activeMenuIndex = index;
    this.isPointerOnPanel = true;
    this.clearCloseTimer();
  }

  onPanelLeave() {
    this.isPointerOnPanel = false;
    this.scheduleClose();
  }

  private scheduleClose() {
    this.clearCloseTimer();

    this.closeTimer = setTimeout(() => {
      if (!this.isPointerOnTrigger && !this.isPointerOnPanel && this.activeMenuIndex !== null) {
        this.activeMenuIndex = null;
      }
    }, 2000);
  }

  private clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/SearchResult'], {
        queryParams: { q: this.searchQuery }
      });
    }
  }

  closeSidebar() {
    const menu = document.querySelector('ion-menu');
    menu?.close();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  async onLogout() {
    await this.authService.logout();
    this.isProfileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const wrapper = document.querySelector('.profile-dropdown-wrapper');
    if (wrapper && !wrapper.contains(event.target as Node)) {
      this.isProfileMenuOpen = false;
    }
  }
}