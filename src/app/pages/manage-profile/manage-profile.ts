import {Component, inject, OnInit} from '@angular/core';
import {GetInputText} from '../../shared/components/get-input-text/get-input-text';
import {SearchTopicsComponent} from '../../shared/components/search-topics/search-topics';
import {Header} from '../../shared/components/header/header';
import {BannerProfile} from '../../shared/components/banner-profile/banner-profile';
import {ActivatedRoute} from '@angular/router';
import {Footer} from '../../shared/components/footer/footer';
import {AbstractControl, FormControl, FormGroup, FormsModule, ValidationErrors, Validators} from '@angular/forms';
import {validSelectedTopics} from '../create-project/create-project';
import {User} from '../../core/models/user.model';
import {Topic} from '../../core/models/topic.model';
import {UserService} from '../../core/services/user-crud';
import {TopicService} from '../../core/services/topic-crud';


@Component({
  selector: 'app-manage-profile',
  imports: [
    GetInputText,
    Header,
    BannerProfile,
    Footer,
    SearchTopicsComponent,
    FormsModule
  ],
  templateUrl: './manage-profile.html',
  styleUrl: './manage-profile.css',
})
export class ManageProfile implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private userService = inject(UserService);
  private topicService = inject(TopicService);
  isLoading: boolean = true;
  id!: string;
  userInformation!: User | undefined;
  topics!: Topic[] | undefined;
  selectedTopics: string[] = [];
  pressedSubmit: Boolean = false;
  users: User[] | undefined;
  description: string = '';
  errorMessage: string = '';

  // ── Modal ──
  showPasswordModal: boolean = false;

  form = new FormGroup({
    nickname: new FormControl(this.userInformation?.Nickname, [Validators.required, this.nicknameExists()]),
    password: new FormControl('', [
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|\\:;"'<>,.?\/]).+$/)
    ]),
    userPhone: new FormControl('', [
      Validators.pattern(/^\+?[\d\s\-]{9,15}$/), Validators.nullValidator
    ]),
    email: new FormControl(this.userInformation?.Gmail, [Validators.required, Validators.email]),
    currentPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.topicService.getTopics().subscribe(topics => {
      this.topics = topics;
    });

    this.userService.getUser().subscribe(users => {
      this.users = users;
      this.userInformation = users.find(u => u.uid?.toString() === this.id);
      this.form.patchValue({
        nickname: this.userInformation?.Nickname,
        email: this.userInformation?.Gmail,
        userPhone: this.userInformation?.Telephone
      });
      const rawTopics = this.userInformation?.Topic;
      this.selectedTopics = Array.isArray(rawTopics) ? [...rawTopics] : Object.values(rawTopics ?? {});
      this.isLoading = false;

      this.userInformation = users.find(u => u.uid?.toString() === this.id);
      this.description = this.userInformation?.Description ?? '';  // ← añade esto
    });


  }

  getControl(name: string): AbstractControl {
    return this.form.get(name)!;
  }

  getTopics(t: Topic[]) {
    this.topics = t;
  }

  getTopicsIds(topics: string[]) {
    this.selectedTopics = topics;
  }

  validTopicsSelection() {
    return validSelectedTopics(this.selectedTopics, this.topics!);
  }

  nicknameExists() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!this.users) return null;
      const name = control.value;
      const exists = this.users
        .filter(u => u.uid !== this.route.snapshot.params['id'])
        .some(u => u.Nickname === name);
      return exists ? { nicknameExists: true } : null;
    };
  }

  openPasswordModal(): void {
    this.pressedSubmit = true;
    const { currentPassword, ...rest } = this.form.controls;
    const mainFormValid = Object.values(rest).every(c => c.valid);
    if (!mainFormValid || !this.validTopicsSelection()) return;
    this.getControl('currentPassword').reset();
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.getControl('currentPassword').reset();
  }

  confirmAndSubmit(): void {
    const pwControl = this.getControl('currentPassword');
    pwControl.markAsTouched();
    if (!pwControl.valid) return;
    this.showPasswordModal = false;
    this.onSubmit();
  }

  async onSubmit() {
    if (this.validTopicsSelection() && this.form.valid) {
      console.log("Cambios confirmados");
      const currentPassword = this.form.get('currentPassword')?.value;
      const data: Partial<User> = {
        Nickname: this.form.get('nickname')?.value ?? undefined,
        Gmail: this.form.get('email')?.value ?? undefined,
        Telephone: this.form.get('userPhone')?.value ?? undefined,
        Password: this.form.get('password')?.value || undefined,
        Topic: this.selectedTopics?.length ? this.selectedTopics : undefined,
        Description: this.description || undefined
      };

      try {
        await this.userService.updateUser(this.userInformation!.uid, data, currentPassword!);
        history.back();
      } catch (error: any) {
        if (error?.code === 'auth/wrong-password') {
          this.errorMessage = 'La contraseña actual es incorrecta.';
        } else if (error?.code === 'auth/too-many-requests') {
          this.errorMessage = 'Demasiados intentos fallidos. Inténtalo más tarde.';
        } else {
          this.errorMessage = 'Ha ocurrido un error al guardar los cambios. Inténtalo de nuevo.';
        }
      }
    }
  }

  protected readonly history = history;
}
