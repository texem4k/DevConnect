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
import {
  IonContent, IonTextarea, IonItem, IonLabel, IonButton, IonNote, IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-manage-profile',
  imports: [
    GetInputText,
    Header,
    BannerProfile,
    Footer,
    SearchTopicsComponent,
    FormsModule,
    IonContent,
    IonTextarea,
    IonItem,
    IonLabel,
    IonButton,
    IonNote,
    IonText,
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
  pressedSubmit: boolean = false;
  description: string = '';

  form = new FormGroup({
    nickname: new FormControl('', [Validators.required, this.nicknameExists()]),
    password: new FormControl('', [
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{}|\\:;"'<>,.?\/]).+$/)
    ]),
    userPhone: new FormControl('', [
      Validators.pattern(/^\+?[\d\s\-]{9,15}$/), Validators.nullValidator
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.topicService.getTopics().subscribe(topics => {
      this.topics = topics;
    });

    this.userService.getUserById(this.id).subscribe(user => {
      this.userInformation = user;
      this.form.patchValue({
        nickname: user?.Nickname,
        email: user?.Gmail,
        userPhone: user?.Telephone
      });
      const rawTopics = user?.Topic;
      this.selectedTopics = Array.isArray(rawTopics) ? [...rawTopics] : Object.values(rawTopics ?? {});
      this.isLoading = false;
      this.description = user?.Description ?? '';
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
      if (!control.value) return null;
      this.userService.getUserByNickname(control.value).subscribe(user => {
        if (user && user.uid !== this.id) {
          control.setErrors({ nicknameExists: true });
        }
      });
      return null;
    };
  }

  async onSubmit() {
    this.pressedSubmit = true;
    if (!this.form.valid || !this.validTopicsSelection()) return;

    const oldNickname = this.userInformation?.Nickname;
    const data: Partial<User> = {
      Nickname: this.form.get('nickname')?.value ?? undefined,
      Gmail: this.form.get('email')?.value ?? undefined,
      Telephone: this.form.get('userPhone')?.value ?? undefined,
      Password: this.form.get('password')?.value || undefined,
      Topic: this.selectedTopics?.length ? this.selectedTopics : undefined,
      Description: this.description || undefined
    };

    await this.userService.updateUser(this.userInformation!.uid, data, oldNickname);
    history.back();
  }

  protected readonly history = history;
}
