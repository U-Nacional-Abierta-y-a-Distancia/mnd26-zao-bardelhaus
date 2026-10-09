import { Component, inject } from '@angular/core';
import { NotificacionesService } from './notificaciones.service';

@Component({
  selector: 'app-notificaciones',
  template: `
    <div class="pila" aria-live="assertive">
      @for (a of avisos(); track a.id) {
        <div class="aviso" [class.exito]="a.tipo === 'exito'" [attr.role]="a.tipo === 'error' ? 'alert' : 'status'">
          <span class="icono" aria-hidden="true">{{ a.tipo === 'error' ? '!' : '✓' }}</span>
          <p>{{ a.texto }}</p>
          <button type="button" class="cerrar" aria-label="Cerrar aviso" (click)="cerrar(a.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: `
    .pila {
      position: fixed;
      top: 4.5rem;
      right: 1rem;
      left: 1rem;
      z-index: 100;
      display: grid;
      justify-items: end;
      gap: 0.6rem;
      pointer-events: none;
    }
    .aviso {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      width: min(24rem, 100%);
      background: #fff;
      color: var(--tinta);
      border-left: 5px solid #b3401f;
      border-radius: 12px;
      padding: 0.85rem 0.75rem 0.85rem 1rem;
      box-shadow: 0 8px 24px rgb(31 41 36 / 0.22);
      font-size: 0.98rem;
      line-height: 1.4;
      animation: entrar 0.25s ease-out;
    }
    .aviso.exito { border-left-color: var(--hoja); }
    .icono {
      flex: none;
      display: grid;
      place-items: center;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 50%;
      background: #b3401f;
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
    }
    .exito .icono { background: var(--hoja); }
    p { margin: 0.1rem 0 0; flex: 1; }
    .cerrar {
      flex: none;
      border: 0;
      background: none;
      font-size: 1.4rem;
      line-height: 1;
      color: var(--tinta-2);
      cursor: pointer;
      padding: 0 0.25rem;
    }
    @keyframes entrar {
      from { transform: translateX(1.5rem); }
      to { transform: none; }
    }
  `,
})
export class Notificaciones {
  private readonly servicio = inject(NotificacionesService);
  protected readonly avisos = this.servicio.avisos;

  protected cerrar(id: number): void {
    this.servicio.cerrar(id);
  }
}
