
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
  where, arrayUnion, arrayRemove, getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import {User} from '../models/user.model';
import {switchMap} from 'rxjs/operators';
import {Topic} from '../models/topic.model';

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

  async addProject(project: Project) {
    const projectDocRef = await addDoc(this.projectRef, project);
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('Nickname', '==', project.creator));
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
      Object.entries(data)
        .filter(([_, value]) => value !== undefined)
    );

    return updateDoc(projectDocRef, firestoreData);
  }

  async deleteProject(id: string) {
    const q = query(collection(this.firestore, 'users'), where('Projects', '==', id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        projects: arrayRemove(id)
      });
    }
    return deleteDoc(doc(this.firestore, `projects/${id}`));
  }

  addProjectTopic(id: string, topic: Topic) {
    const projectRef = doc(this.firestore, `projects/${id}`);
    return updateDoc(projectRef, {
      requireTopic: arrayUnion(topic)
    });
  }

  removeProjectTopic(id: string, topic: Topic) {
    const projectRef = doc(this.firestore, `projects/${id}`);
    return updateDoc(projectRef, {
      requireTopic: arrayRemove(topic)
    });
  }

  getMaintainers(projectId: string): Observable<User[]> {
    return docData(doc(this.firestore, `projects/${projectId}`)).pipe(
      switchMap((project) => {
        const data = project as Project;
        const usersRef = collection(this.firestore, "users");

        const q = query(
          usersRef,
          where("__name__", "in", data.maintainers)
        );

        return collectionData(q, { idField: "id" }) as Observable<User[]>;
      })
    );
  }
}
