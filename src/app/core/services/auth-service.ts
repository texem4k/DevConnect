import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  isLoggedIn$: Observable<boolean> = new Observable(observer => {
    this.currentUser$.subscribe(user => observer.next(!!user));
  });

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUserSubject.next(user);
    });
  }

  getPhotoURL(): string {
    return this.currentUserSubject.value?.photoURL
      ?? 'https://cdn-icons-png.flaticon.com/256/149/149071.png';
  }

  getDisplayName(): string {
    return this.currentUserSubject.value?.displayName ?? 'Usuario';
  }

  getEmail(): string {
    return this.currentUserSubject.value?.email ?? '';
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }
}
