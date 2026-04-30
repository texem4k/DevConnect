import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {DataLoader} from '../../shared/services/get-data-service';
import {SearchTopicsComponent} from '../../shared/components/search-topics/search-topics';
import {Project} from '../../shared/services/Project';
import {Router} from '@angular/router';
import {JsonPipe} from '@angular/common';
import {Topic} from '../../shared/services/Topic';

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

  projects: Project[]=[];
  topicsIds: Number[]=[];
  topics: Topic[] = [];

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


  constructor(private el: ElementRef,private dataLoader: DataLoader,private router: Router){}


  ngOnInit(): void {
    this.dataLoader.loadData(
      { loadProjects: true },
      ({ projectData }) => {
        this.projects = projectData ?? [];
      }
    );
  }


  ngAfterViewInit() {
    // Busca todas las etiquetas con la clase 'destacado' solo en este componente
    const elementos = this.el.nativeElement.querySelectorAll('.fieldFeedBack');
    console.log(elementos); // Nodelist de los elementos

    elementos.forEach((el: HTMLElement) => {
      console.log(el.tagName); // Acceso a la etiqueta
    });
  }


  //Valida si hay al menos un idioma y un lenguaje de programación
  validSelectedTopics(){
    let hasLanguage: Boolean = false;
    let hasPL: Boolean = false;
    for(let x in this.topicsIds){
      const temp = this.topics.find(t => t.id === Number(x))
      if(temp?.cat!==undefined && temp?.cat== "Idioma"){
        hasLanguage = true;
      }
      if(temp?.cat!==undefined && temp?.cat== "Lenguaje"){
        hasPL = true;
      }
    }
    return hasLanguage && hasPL;
  }


  getControl(name: string): AbstractControl {
    return this.form.get(name)!;
  }


  getTopics(t: Topic[]){
    this.topics = t;
  }

  getTopicsIds(topics: Number[]){
    this.topicsIds=topics
  }
  onSubmit() {

    //Añadir a este if el local storage y eso para mantener iniciada la sesión
    if (this.form.valid && this.validSelectedTopics()) {
      history.back();
    }
    else{
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

  const fechaIngresada = new Date(control.value + 'T00:00:00'); // evita desfase UTC

  return fechaIngresada < hoy ? { fechaNoAnteriorAHoy: true } : null;
}


export function itExists(projects: Project[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    const exists = projects.some(p => p.title.toLowerCase() === name?.toLowerCase());

    return exists ? { itExists: true } : null;
  };
}
