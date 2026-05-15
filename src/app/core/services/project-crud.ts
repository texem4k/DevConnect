import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
  getDocs
} from '@angular/fire/firestore';
import {Observable, of} from 'rxjs';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';
import { switchMap } from 'rxjs/operators';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private firestore = inject(Firestore);
  private projectRef = collection(this.firestore, 'projects');

  getProject(): Observable<Project[]> {
    return collectionData(this.projectRef, { idField: 'id' }) as Observable<Project[]>;
  }

  getProjectById(id: string): Observable<Project> {
    const ref = doc(this.firestore, `projects/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<Project>;
  }

  getProjectsByCreator(creator: string): Observable<Project[]> {
    const q = query(this.projectRef, where('creator', '==', creator));
    return collectionData(q, { idField: 'id' }) as Observable<Project[]>;
  }

  getProjectByTitle(title: string): Observable<Project[]> {
    const q = query(this.projectRef, where('title', '==', title));
    return collectionData(q, { idField: 'id' }) as Observable<Project[]>;
  }

  async addProject(project: Project, creatorUid: string) {
    const projectDocRef = await addDoc(this.projectRef, project);

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('uid', '==', creatorUid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        Projects: arrayUnion({ id: projectDocRef.id })
      });
    }

    return projectDocRef;
  }

  updateProject(id: string, data: Partial<Project>) {
    const projectDocRef = doc(this.firestore, `projects/${id}`);

    const firestoreData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    return updateDoc(projectDocRef, firestoreData);
  }

  async deleteProject(projectId: string, creatorUid: string) {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('uid', '==', creatorUid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        Projects: arrayRemove({ id: projectId })
      });
    }

    return deleteDoc(doc(this.firestore, `projects/${projectId}`));
  }

  getMaintainers(projectId: string): Observable<User[]> {
    return docData(doc(this.firestore, `projects/${projectId}`)).pipe(
    switchMap((project) => {
      const data = project as Project;
      if (!data.maintainers || data.maintainers.length === 0) {
        return of([] as User[]);
      }
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('uid', 'in', data.maintainers));
      return collectionData(q, { idField: 'id' }) as Observable<User[]>;
    })
  );
  }
}
