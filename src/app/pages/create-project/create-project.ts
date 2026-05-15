import {Component, inject, OnInit} from '@angular/core';
import {Footer} from '../../shared/components/footer/footer';
import {GetInputText} from '../../shared/components/get-input-text/get-input-text';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {SearchTopicsComponent} from '../../shared/components/search-topics/search-topics';
import {ProjectService} from '../../core/services/project-crud';
import {Project} from '../../core/models/project.model';
import {Topic} from '../../core/models/topic.model';
import {ActivatedRoute} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '../../core/services/auth-service';
import {UserService} from '../../core/services/user-crud';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItem, IonLabel, IonTextarea, IonDatetime, IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-project',
  imports: [
    Footer,
    GetInputText,
    ReactiveFormsModule,
    SearchTopicsComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonTextarea,
    IonDatetime,
    IonNote,
  ],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})
export class CreateProject implements OnInit {

  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private userService = inject(UserService);
  private projectOwnerUid: string = '';
  private projectOwnerName: string = '';


  projects: Project[] = [];
  topicsIds: string[] = [];
  topics: Topic[] = [];
  project?: Project;
  isSubmitting: boolean = false;
  description: string = '';

  form = new FormGroup({
    projectName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    ownerEmail: new FormControl('', [Validators.required, Validators.email]),
    numberParticipants: new FormControl('', [Validators.required]),
    ownerPhone: new FormControl('', [Validators.pattern(/^\+?[\d\s\-]{9,15}$/)]),
    date: new FormControl('', [Validators.required, fechaNoAnteriorAHoy]),
    description: new FormControl(''),
  });

  pressedSubmit: boolean = false;
  projectId?: string;

  get submitButtonLabel(): string {
    if (this.isSubmitting) {
      return this.projectId ? 'Actualizando proyecto...' : 'Creando proyecto...';
    }
    return this.projectId ? 'Actualizar proyecto' : 'Crear proyecto';
  }

  async ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      if (user?.uid) {
        this.projectOwnerUid = user.uid;
        this.userService.getUserById(user.uid).subscribe(userData => {
          this.projectOwnerName = userData?.Nickname ?? '';
        });
      }
    });

    this.projectId = this.route.snapshot.params['id'];

    if (this.projectId) {
      this.project = await firstValueFrom(this.projectService.getProjectById(this.projectId));
      if (this.project) {
        this.form.patchValue({
          projectName: this.project.title,
          ownerEmail: this.project.ownerEmail,
          numberParticipants: this.project.numberParticipants?.toString() ?? '',
          ownerPhone: this.project.ownerPhone,
          date: this.project.limitDate ? this.formatDate(this.project.limitDate) : '',
          description: this.project.description,
        });

        this.project.requireTopic.forEach(x => {
          this.topicsIds.push(x);
        });
      }
    }
  }

  validTopicsSelection() {
    return validSelectedTopics(this.topicsIds, this.topics);
  }

  getControl(name: string): AbstractControl {
    return this.form.get(name)!;
  }

  getTopics(t: Topic[]) {
    this.topics = t;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  getTopicsIds(topics: string[]) {
    this.topicsIds = topics;
  }

  async onSubmit() {
    if (this.form.valid && this.validTopicsSelection()) {
      const title = this.form.get('projectName')?.value;
      if (title && !this.projectId) {
        const existing = await firstValueFrom(this.projectService.getProjectByTitle(title));
        if (existing.length > 0) {
          this.form.get('projectName')?.setErrors({ itExists: true });
          this.pressedSubmit = true;
          return;
        }
      }

      this.isSubmitting = true;

      const rawValue = this.form.value;
      const formValue: Partial<Project> = {};

      if (rawValue.projectName)        formValue.title              = rawValue.projectName;
      if (rawValue.ownerEmail)         formValue.ownerEmail         = rawValue.ownerEmail;
      if (rawValue.numberParticipants) formValue.numberParticipants = Number(rawValue.numberParticipants);
      if (rawValue.ownerPhone)         formValue.ownerPhone         = rawValue.ownerPhone;
      if (rawValue.date)               formValue.limitDate          = rawValue.date;
      if (rawValue.description)        formValue.description        = rawValue.description;
      if (this.topicsIds?.length)      formValue.requireTopic       = this.topicsIds;
      formValue.creator = this.projectOwnerName;

      if(!this.project?.image){
        formValue.image= 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fm=jpg&w=1600&h=400&fit=crop'
      }
      if (this.projectId) {
        this.projectService.updateProject(this.projectId, formValue)
          .then(() => history.back())
          .catch((err: any) => {
            console.error('Error al actualizar:', err);
            this.isSubmitting = false;
          });
      } else {
        this.projectService.addProject(formValue as Project, this.projectOwnerUid)
          .then(() => history.back())
          .catch((err: any) => {
            console.error('Error al crear:', err);
            this.isSubmitting = false;
          });
      }
    } else {
      this.pressedSubmit = true;
    }
  }

  protected readonly history = history;
}

export function fechaNoAnteriorAHoy(control: AbstractControl): null | ValidationErrors {
  if (!control.value) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaIngresada = new Date(control.value + 'T00:00:00');
  return fechaIngresada < hoy ? { fechaNoAnteriorAHoy: true } : null;
}

export function itExists(projects: Project[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    const exists = projects.some(p => p.title.toLowerCase() === name?.toLowerCase());
    return exists ? { itExists: true } : null;
  };
}

export function validSelectedTopics(topicsIds: string[], topics: Topic[]) {
  let hasLanguage: boolean = false;
  let hasPL: boolean = false;
  for (let id of topicsIds) {
    const temp = topics.find(t => t.id === id);
    if (temp?.cat === 'Idioma') hasLanguage = true;
    if (temp?.cat === 'Lenguaje') hasPL = true;
  }
  return hasLanguage && hasPL;
}
