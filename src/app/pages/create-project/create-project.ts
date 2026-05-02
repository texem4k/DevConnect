import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-create-project',
  imports: [
    Footer,
    GetInputText,
    ReactiveFormsModule,
    SearchTopicsComponent
  ],
  templateUrl: './create-project.html',
  styleUrl: './create-project.css',
})



export class CreateProject implements AfterViewInit, OnInit {

  private el = inject(ElementRef);
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);


  projects: Project[]=[];
  topicsIds: string[]=[];
  topics: Topic[] = [];
  projectsData$ = this.projectService.getProject()
  project?: Project;



  form = new FormGroup(
    {
      projectName: new FormControl('', [Validators.required, itExists(this.projects), Validators.minLength(5)]),
      ownerEmail: new FormControl('', [Validators.required, Validators.email]),
      numberParticipants: new FormControl('', [Validators.required]),
      ownerPhone: new FormControl('', [Validators.pattern(/^\+?[\d\s\-]{9,15}$/)]),
      date: new FormControl('', [Validators.required, fechaNoAnteriorAHoy]),
    }
  )
  pressedSubmit: Boolean = false;

  projectId?: string;

  async ngOnInit() {
    this.projectsData$.subscribe(projects => {
      this.projects = projects;
    });
    this.projectId = this.route.snapshot.params["id"];
    this.project = await firstValueFrom(this.projectService.getProjectById(this.projectId!));
    if (this.project) {
      this.form.patchValue({
        projectName: this.project.title,
        ownerEmail: this.project.ownerEmail,
        numberParticipants: this.project.numberParticipants?.toString() ?? "",
        ownerPhone: this.project.ownerPhone,
        date: this.project.limitDate ? this.formatDate(this.project.limitDate) : ''
      });

      this.project.requireTopic.forEach(x => {
        this.topicsIds.push(x);
      });
    }
  }


  ngAfterViewInit() {
    const elementos = this.el.nativeElement.querySelectorAll('.fieldFeedBack');
    console.log(elementos);

    elementos.forEach((el: HTMLElement) => {
      console.log(el.tagName);
    });
  }


    validTopicsSelection(){
    return validSelectedTopics(this.topicsIds, this.topics)
    }


  getControl(name: string): AbstractControl {
    return this.form.get(name)!;
  }


  getTopics(t: Topic[]){
    this.topics = t;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0]; // → "2025-12-31"
  }

  getTopicsIds(topics: string[]){
    this.topicsIds = topics
  }
  onSubmit() {
    if (this.form.valid && this.validTopicsSelection()) {
      const formValue: Partial<Project> = {
        title: this.form.value.projectName ?? undefined,
        ownerEmail: this.form.value.ownerEmail ?? undefined,
        numberParticipants: Number(this.form.value.numberParticipants) ?? undefined,
        ownerPhone: this.form.value.ownerPhone ?? undefined,
        limitDate: this.form.value.date ?? undefined,
        requireTopic: this.topicsIds ?? undefined,
      };

      if (this.projectId) {
        this.projectService.updateProject(this.projectId, formValue)
          .then(() => history.back())
          .catch((err: any) => console.error('Error al actualizar:', err));
      } else {
        this.projectService.addProject(formValue as Project)
          .then(() => history.back())
          .catch((err: any) => console.error('Error al crear:', err));
      }
    } else {
      this.pressedSubmit = true;
    }
  }

  protected readonly String = String;
  protected readonly document = document;
  protected openCalendar(dateInput: HTMLInputElement) {
    dateInput.showPicker();
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
  let hasLanguage: Boolean = false;
  let hasPL: Boolean = false;

  for (let id of topicsIds) {
    const temp = topics.find(t => t.id === id);
    if (temp?.cat === "Idioma") hasLanguage = true;
    if (temp?.cat === "Lenguaje") hasPL = true;
  }

  return hasLanguage && hasPL;
}
