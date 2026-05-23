import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular/standalone';
import { HeaderElementsService } from '../../../core/services/headerElements-service';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [
    AsyncPipe,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private headerService = inject(HeaderElementsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private menuCtrl = inject(MenuController);

  topicos$ = this.headerService.getTopics();
  isLoggedIn = false;
  currentUserId = '';
  expandedCategories: Record<string, boolean> = {};

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.uid ?? '';
    });
  }

  toggleCategory(id: string) {
    this.expandedCategories[id] = !this.expandedCategories[id];
  }

  isCategoryExpanded(id: string): boolean {
    return !!this.expandedCategories[id];
  }

  buildQueryParams(key: string, value: string): Record<string, string> {
    return { [key]: value };
  }

  closeSidebar() {
    this.menuCtrl.close('sidebar');
  }

  async onLogout() {
    await this.authService.logout();
    this.closeSidebar();
  }
}
