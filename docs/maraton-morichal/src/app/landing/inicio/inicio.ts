import { Component, input, output } from '@angular/core';
import { SeccionLanding } from '../../core/morichal.config';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  readonly compacta = input(false);

  readonly seleccion = output<SeccionLanding>();

  protected readonly opciones: { id: SeccionLanding; texto: string; clase: string }[] = [
    { id: 'casa', texto: 'Conocer mi casa', clase: 'btn-moriche' },
    { id: 'estado', texto: 'Estado de mi casa', clase: 'btn-sabana' },
    { id: 'guardian', texto: 'Ser guardián del morichal', clase: 'btn-borde' },
  ];
}
