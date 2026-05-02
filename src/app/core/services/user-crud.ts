import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData,
  setDoc, doc, updateDoc, deleteDoc, docData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  Auth,
  updateEmail, updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification
} from '@angular/fire/auth';
import { User } from '../models/user.model';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private userRef = collection(this.firestore, 'users');

  getUser(): Observable<User[]> {
    return collectionData(this.userRef, { idField: 'id' }) as Observable<User[]>;
  }

  getUserById(id: string): Observable<User> {
    const ref = doc(this.firestore, `users/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<User>;
  }

  async addUser(user: User) {
    const cred = await this.authService.register(user.gmail, user.password);
    await sendEmailVerification(cred.user);
    return setDoc(doc(this.firestore, 'users', cred.user.uid), {
      Fullname:    user.fullname,
      Nickname:    user.nickname,
      Gmail:       user.gmail,
      Description: user.description,
      Topic:       user.topic,
      Projects:    user.projects,
      Avatar:      user.avatar,
      Banner:      user.banner,
      Social:      user.social,
      CV:          user.cv
    });
  }

  async updateUser(id: string, data: Partial<User>, currentPassword: string) {
    const currentUser = this.authService.currentUser;
    const docRef = doc(this.firestore, `users/${id}`);

    const fieldMap: Partial<Record<keyof User, string>> = {
      fullname:    'Fullname',
      nickname:    'Nickname',
      description: 'Description',
      topic:       'Topic',
      banner:      'Banner',
      cv:          'CV',
      avatar:      'Avatar',
      projects:    'Projects',
      social:      'Social',
    };

    const firestoreData = Object.fromEntries(
      Object.entries(fieldMap)
        .filter(([key]) => data[key as keyof User] !== undefined)
        .map(([key, fsKey]) => [fsKey, data[key as keyof User]])
    );

    if (currentUser && (data.gmail || data.password) && currentPassword) {
      const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await Promise.all([
        data.gmail && data.gmail !== currentUser.email
          ? updateEmail(currentUser, data.gmail)
          : null,
        data.password
          ? updatePassword(currentUser, data.password)
          : null,
      ].filter(Boolean) as Promise<void>[]);

      await sendEmailVerification(currentUser);
    }

    if (Object.keys(firestoreData).length > 0) {
      await updateDoc(docRef, firestoreData);
    }
  }

  async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `users/${id}`));
    await this.authService.deleteAccount();
  }
}
