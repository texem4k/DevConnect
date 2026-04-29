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
import { Project } from '../models/project.model';

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
    return collectionData(ref, { idField: 'id' }) as Observable<Project>;
  }

  addProject(project: Project) {
    return addDoc(this.projectRef, {
      title: project.title,
      creator: project.creator,
      isCompanyProject: project.isCompanyProject,
      image: project.image,
      description: project.description,
      requirements: project.requirements,
      maintainers: project.maintainers
    });
  }

  updateProject(id: string, data: Partial<Project>) {
    const projectDocRef = doc(this.firestore, `projects/${id}`);
    return updateDoc(projectDocRef, { ...data });
  }

  deleteProject(id: string) {
    const projectDocRef = doc(this.firestore, `projects/${id}`);
    return deleteDoc(projectDocRef);
  }

  getMaintainers(projectId: string): Observable<User[]> {
    return docData(doc(this.firestore, `projects/${projectId}`)).pipe(
      switchMap((project: Project) => {
        const usersRef = collection(this.firestore, "users");

        const q = query(
          usersRef,
          where("__name__", "in", project.maintainers)
        );

        return collectionData(q, { idField: "id" });
      })
    );
  }
}
