import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dialogo-oso',
  template: `
    <div class="dialogo" [class.oso-derecha]="lado() === 'derecha'">
      @if (lado() === 'izquierda') {
        <img class="oso espejo" src="img/oso-palmero.png" alt="" />
      }
      <div class="burbuja" [class.larga]="larga()"><ng-content /></div>
      @if (lado() === 'derecha') {
        <img class="oso" src="img/oso-palmero.png" alt="" />
      }
    </div>
  `,
  styleUrl: './dialogo-oso.css',
})
export class DialogoOso {
  readonly lado = input<'izquierda' | 'derecha'>('izquierda');
  readonly larga = input(false);
}
