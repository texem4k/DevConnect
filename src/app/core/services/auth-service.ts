import { Injectable } from '@angular/core';
import {
  Auth, onAuthStateChanged, signOut, User,
  setPersistence, signInWithEmailAndPassword,
  browserLocalPersistence, createUserWithEmailAndPassword, deleteUser
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUserSubject.next(user);
    });
  }

  async register(email: string, password: string) {
    await setPersistence(this.auth, browserLocalPersistence);
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string): Promise<void> {
    await setPersistence(this.auth, browserLocalPersistence);
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.getValue();
  }

  async deleteAccount(): Promise<void> {
    const user = this.currentUser;
    if (!user) throw new Error('No hay usuario autenticado');
    await deleteUser(user);
    this.currentUserSubject.next(null);
  }
}
