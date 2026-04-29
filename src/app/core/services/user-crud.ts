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
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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

  updateUser(id: string, data: Partial<User>) {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return updateDoc(userDocRef, { ...data });
  }

  deleteUser(id: string) {
    const userDocRef = doc(this.firestore, `users/${id}`);
    return deleteDoc(userDocRef);
  }
}
