import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-user-data-field',
  imports: [],
  templateUrl: './user-data-field.html',
  styleUrl: './user-data-field.css',
})
export class UserDataField {
  @Input() socialNetwork: string = ''
  @Input() title: string = ''
  @Input() link: string = ''
}
