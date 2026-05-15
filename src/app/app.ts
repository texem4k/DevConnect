import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular/standalone';
import { HeaderElementsService } from './core/services/headerElements-service';
import { AuthService } from './core/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonLabel,
    RouterModule,
    AsyncPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('DevConnect');

  private headerService = inject(HeaderElementsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private menuCtrl = inject(MenuController);

  topicos$ = this.headerService.getTopics();
  isLoggedIn = false;
  currentUserId = '';

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(logged => {
      this.isLoggedIn = logged;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUserId = user?.uid ?? '';
    });
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
