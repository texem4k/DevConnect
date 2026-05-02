import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData,
  setDoc, doc, updateDoc, deleteDoc, docData, arrayUnion, arrayRemove
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  updateEmail, updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification
} from '@angular/fire/auth';
import { User } from '../models/user.model';
import { AuthService } from './auth-service';
import {Topic} from '../models/topic.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private userRef = collection(this.firestore, 'users');

  getUser(): Observable<User[]> {
    return collectionData(this.userRef, { idField: 'uid' }) as Observable<User[]>;
  }

  getUserById(id: string): Observable<User> {
    const ref = doc(this.firestore, `users/${id}`);
    return docData(ref, { idField: 'uid' }) as Observable<User>;
  }

  async addUser(user: User) {
    const cred = await this.authService.register(user.Gmail, user.Password);
    await sendEmailVerification(cred.user);
    return setDoc(doc(this.firestore, 'users', cred.user.uid), user );
  }

  async updateUser(id: string, data: Partial<User>, currentPassword: string) {
    const currentUser = this.authService.currentUser;
    const docRef = doc(this.firestore, `users/${id}`);

    const firestoreData = Object.fromEntries(
      Object.entries(data)
        .filter(([_ , value]) => value !== undefined)
    );

    if (currentUser && (data.Gmail || data.Password) && currentPassword) {
      const credential = EmailAuthProvider.credential(currentUser.email!, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      await Promise.all([
        data.Gmail && data.Gmail !== currentUser.email
          ? updateEmail(currentUser, data.Gmail)
          : null,
        data.Password
          ? updatePassword(currentUser, data.Password)
          : null,
      ].filter(Boolean) as Promise<void>[]);

      await sendEmailVerification(currentUser);
    }

    if (Object.keys(firestoreData).length > 0) {
      await updateDoc(docRef, firestoreData);
    }
  }

  addUserTopic(id: string, topic: Topic) {
    const userRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userRef, {
      Topic: arrayUnion(topic)
    });
  }

  removeUserTopic(id: string, topic: Topic) {
    const userRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userRef, {
      Topic: arrayRemove(topic)
    });
  }

  async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `users/${id}`));
    await this.authService.deleteAccount();
  }
}
