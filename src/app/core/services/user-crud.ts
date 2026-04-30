import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider

} from 'firebase/auth';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private userRef = collection(this.firestore, 'users');

  getUser(): Observable<User[]> {
    return collectionData(this.userRef, { idField: 'id' }) as Observable<User[]>;
  }

  getUserById(id: string): Observable<User> {
    const ref = doc(this.firestore, `users/${id}`);
    return collectionData(ref, { idField: 'id' }) as Observable<User>;
  }

  async addUser(user: User) {
    const cred = await createUserWithEmailAndPassword(
      auth,
      user.Gmail,
      user.Password
    );
    return setDoc(doc(this.firestore, 'users', cred.user.uid), {
      Fullname: user.fullname,
      Nickname: user.nickname,
      Gmail: user.gmail,
      Password: user.password,
      Description: user.description,
      Topic: user.topic,
      Projects: user.projects,
      Avatar: user.avatar,
      Banner: user.banner,
      Social: user.social,
      CV: user.cv
    });
  }

  async updateUser(id: string, data: Partial<User>, currentPassword: string) {
    const updates: Promise<void>[] = [];

    updates.push(updateDoc(doc(this.firestore, `users/${id}`), { ...data }));

    const currentUser = this.auth.currentUser;
    if (currentUser) {
      if ((data.gmail || data.password) && currentPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        if (data.gmail != currentUser.email) {
          updates.push(updateEmail(currentUser, data.gmail));
        }
        if (data.password) {
          updates.push(updatePassword(currentUser, data.password));
        }
      }
    }

    return Promise.all(updates);
  }

  deleteUser(id: string) {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDocRef);
  }
}
