import { Component } from '@angular/core';
import {GetInputText} from '../../shared/components/get-input-text/get-input-text';

@Component({
  selector: 'app-user-registration',
  imports: [
    GetInputText
  ],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.css',
})
export class UserRegistration {

  title: string="Registro en Devconnect"
  header1: string="¿Cómo quieres que te vea el mundo?"
  header2: string="Información personal (El nombre y apellido no podrán cambiarse más tarde, tenga cuidado)"
  header3: string="¿Eres un particular o una empresa?"
  header4: string="Busca tus especialidades..."


  protected readonly history = history;
}
