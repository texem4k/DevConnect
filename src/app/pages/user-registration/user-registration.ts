import {Component, inject, OnInit} from '@angular/core';
import {GetInputText} from '../../shared/components/get-input-text/get-input-text';
import {
  AbstractControl, FormControl, FormGroup, FormsModule,
  ReactiveFormsModule, ValidationErrors, Validators
} from '@angular/forms';
import {User} from '../../core/models/user.model';
import {UserService} from '../../core/services/user-crud';
import {ActivatedRoute, Router} from '@angular/router';
import {validSelectedTopics} from '../create-project/create-project';
import {Topic} from '../../core/models/topic.model';
import {TopicService} from '../../core/services/topic-crud';
import {SearchTopicsComponent} from '../../shared/components/search-topics/search-topics';
import {Footer} from '../../shared/components/footer/footer';

@Component({
  selector: 'app-user-registration',
  imports: [
    GetInputText,
    FormsModule,
    SearchTopicsComponent,
    ReactiveFormsModule,
    Footer
  ],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css',
})
export class UserRegistration implements OnInit {

  private userService = inject(UserService);
  private topicsService = inject(TopicService);
  private route = inject(ActivatedRoute);

  users!: User[];
  selectedTopics: string[] = [];
  allTopics!: Topic[];
  pressedSubmit: Boolean = false;
  preview: string | null = null;
  file: File | null = null;

  registrationError = '';

  form!: FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      nickname: new FormControl('', [Validators.required, this.nicknameExists()]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|\\:;"'<>,.?\/]).+$/)
      ]),
      userPhone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+?[\d\s\-]{9,15}$/)
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      retryPassword: new FormControl('', [Validators.required, this.validPasswords.bind(this)]),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÑ\s]+$/)]),
      surname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúüñÑ\s]+$/)]),
      option: new FormControl(null, [Validators.required])
    });

    this.userService.getUser().subscribe(users => {
      this.users = users;
    });

    this.topicsService.getTopics().subscribe(topics => {
      this.allTopics = topics;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(this.file);
  }

  nicknameExists() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.users) return null;
      const exists = this.users
        .filter(u => u.uid !== this.route.snapshot.params['id'])
        .some(u => u.Nickname === control.value);
      return exists ? { nicknameExists: true } : null;
    };
  }

  validPasswords(control: AbstractControl): ValidationErrors | null {
    const pass1 = control.value;
    const pass2 = this.form?.get('password')?.value;
    return pass1 === pass2 ? null : { validPasswords: true };
  }

  getTopics(t: Topic[]) {
    this.allTopics = t;
  }

  getTopicsIds(topics: string[]) {
    this.selectedTopics = topics;
  }

  validTopicsSelection() {
    return validSelectedTopics(this.selectedTopics!, this.allTopics!);
  }

  getControl(name: string): AbstractControl {
    return this.form.get(name)!;
  }

  async onSubmit() {
    this.pressedSubmit = true;
    if (!this.validTopicsSelection() || !this.form.valid) return;

    const data: Partial<User> = {
      Nickname: this.form.get('nickname')?.value ?? undefined,
      Fullname: `${this.form.get('name')?.value ?? ''} ${this.form.get('surname')?.value ?? ''}`.trim() || undefined,
      Gmail: this.form.get('email')?.value ?? undefined,
      Telephone: this.form.get('userPhone')?.value ?? undefined,
      Password: this.form.get('password')?.value ?? undefined,
      Topic: this.selectedTopics,
      isCompany: this.form.get('option')?.value ?? undefined,
      Avatar: this.form.get('Avatar')?.value ?? 'https://cdn-icons-png.flaticon.com/256/149/149071.png'
    };

    const registrationError = '';
    try {
      await this.userService.addUser(data);
      history.back()
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        this.registrationError = 'Este email ya está registrado';
      } else {
        this.registrationError = 'Error al registrar el usuario';
      }
    }
  }

  protected readonly history = history;
}
