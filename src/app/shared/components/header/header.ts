import { Component, HostListener, inject, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderElementsService } from '../../../core/services/headerElements-service';
import { AuthService } from '../../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user-crud';
import { firstValueFrom } from 'rxjs';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonImg, IonSearchbar, IonMenuButton, IonItem, MenuController } from '@ionic/angular/standalone';

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
    IonMenuButton,
    IonItem,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private headerService = inject(HeaderElementsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);
  private menuCtrl = inject(MenuController);

  isLoggedIn = false;
  userPhoto = '';
  currentUserId = '';
  isProfileMenuOpen = false;
  searchQuery = '';
  topicos$ = this.headerService.getTopics();

  activeMenuIndex: number | null = null;
  dropdownPos: { top: number; left: number } | null = null;
  profileDropdownPos: { top: number; right: number } | null = null;

  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private isPointerOnTrigger = false;
  private isPointerOnPanel = false;

  // Flag para ignorar el document:click inmediato tras abrir el menú
  private justOpenedProfile = false;

  @ViewChildren('dropdownBtn', { read: ElementRef }) dropdownBtns!: QueryList<ElementRef>;
  @ViewChild('profileTriggerRef', { read: ElementRef }) profileTriggerRef!: ElementRef;
  @ViewChild('profileDropdownRef', { read: ElementRef }) profileDropdownRef!: ElementRef;

  buildQueryParams(key: string, value: string): Record<string, string> {
    return { [key]: value };
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
    });

    this.authService.currentUser$.subscribe(async user => {
      this.currentUserId = user?.uid ?? '';
      this.userPhoto = await this.getPhotoUser();
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

    const btnEl = this.dropdownBtns?.toArray()[index];
    if (btnEl) {
      const rect = btnEl.nativeElement.getBoundingClientRect();
      this.dropdownPos = { top: rect.bottom, left: rect.left };
    }
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
        this.dropdownPos = null;
      }
    }, 300);
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
    this.menuCtrl.close('sidebar');
  }

  toggleProfileMenu(event: MouseEvent) {
    event.stopPropagation(); // Evita que el document:click lo cierre de inmediato
    this.isProfileMenuOpen = !this.isProfileMenuOpen;

    if (this.isProfileMenuOpen) {
      const btn = event.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      this.profileDropdownPos = {
        top: rect.bottom,
        right: window.innerWidth - rect.right
      };
    } else {
      this.profileDropdownPos = null;
    }
  }

  async onLogout() {
    await this.authService.logout();
    this.isProfileMenuOpen = false;
    this.profileDropdownPos = null;
  }

  // Eliminado @HostListener('mouseleave') — causaba cierres inesperados en otras páginas

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Cerrar dropdown de tópicos
    if (this.activeMenuIndex !== null) {
      const target = event.target as Node;
      const triggers = document.querySelectorAll('.header-left .dropdown');
      const dropdownPanel = document.querySelector('.dropdown-content.fixed');

      let isInsideDropdown = false;
      triggers.forEach(t => { if (t.contains(target)) isInsideDropdown = true; });
      if (dropdownPanel?.contains(target)) isInsideDropdown = true;

      if (!isInsideDropdown) {
        this.activeMenuIndex = null;
        this.dropdownPos = null;
        this.isPointerOnTrigger = false;
        this.isPointerOnPanel = false;
      }
    }

    // Cerrar perfil — el stopPropagation en toggleProfileMenu ya protege la apertura
    if (this.isProfileMenuOpen) {
      const target = event.target as Node;
      const triggerEl = this.profileTriggerRef?.nativeElement;
      const panelEl = this.profileDropdownRef?.nativeElement;

      const isInsideProfile =
        (triggerEl && triggerEl.contains(target)) ||
        (panelEl && panelEl.contains(target));

      if (!isInsideProfile) {
        this.isProfileMenuOpen = false;
        this.profileDropdownPos = null;
      }
    }
  }
}
