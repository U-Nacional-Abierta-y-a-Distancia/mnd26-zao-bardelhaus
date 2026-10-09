import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'error' | 'exito';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  texto: string;
}

const DURACION_MS = 7000;

@Injectable({ providedIn: 'root' })
export class NotificacionesService {
  private siguienteId = 0;
  private readonly _avisos = signal<Notificacion[]>([]);
  readonly avisos = this._avisos.asReadonly();

  error(texto: string): void {
    this.mostrar('error', texto);
  }

  exito(texto: string): void {
    this.mostrar('exito', texto);
  }

  cerrar(id: number): void {
    this._avisos.update((lista) => lista.filter((a) => a.id !== id));
  }

  private mostrar(tipo: TipoNotificacion, texto: string): void {
    if (this._avisos().some((a) => a.tipo === tipo && a.texto === texto)) return;
    const id = ++this.siguienteId;
    this._avisos.update((lista) => [...lista, { id, tipo, texto }]);
    setTimeout(() => this.cerrar(id), DURACION_MS);
  }
}
