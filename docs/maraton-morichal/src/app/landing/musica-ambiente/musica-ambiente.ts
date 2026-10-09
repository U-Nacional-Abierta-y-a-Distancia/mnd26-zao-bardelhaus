import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { MORICHAL_CONFIG } from '../../core/morichal.config';

const CLAVE_PAUSA_ANTERIOR = 'morichal-sonido-pausado';
const VOLUMEN = 0.2;

@Component({
  selector: 'app-musica-ambiente',
  template: `
    <button
      type="button"
      class="sonido"
      [class.sonando]="sonando()"
      [attr.aria-pressed]="sonando()"
      [attr.aria-label]="sonando() ? 'Pausar el sonido del bosque' : 'Reproducir el sonido del bosque'"
      [attr.title]="sonando() ? 'Pausar el sonido del bosque' : 'Reproducir el sonido del bosque'"
      (click)="alternar()"
    >
      @if (sonando()) {
        <span class="barras" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      } @else {
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z" />
          <path d="m16 9 5 6m0-6-5 6" />
        </svg>
      }
      <span class="texto">{{ sonando() ? 'Sonido' : 'Activar sonido' }}</span>
    </button>
  `,
  styleUrl: './musica-ambiente.css',
})
export class MusicaAmbiente {
  protected readonly sonando = signal(false);

  private audio?: HTMLAudioElement;
  private pausadoPorPersona = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      this.audio = new Audio(MORICHAL_CONFIG.musicaAmbiente);
      this.audio.loop = true;
      this.audio.volume = VOLUMEN;
      this.audio.preload = 'auto';
      this.audio.addEventListener('play', () => this.sonando.set(true));
      this.audio.addEventListener('pause', () => this.sonando.set(false));

      olvidarPausaAnterior();

      this.reproducir();

      const eventos = ['pointerdown', 'keydown', 'touchstart'] as const;
      const alInteractuar = (ev: Event) => {
        quitar();
        if ((ev.target as HTMLElement | null)?.closest?.('app-musica-ambiente')) return;
        if (!this.pausadoPorPersona && this.audio?.paused) this.reproducir();
      };
      const quitar = () => eventos.forEach((e) => document.removeEventListener(e, alInteractuar, true));
      eventos.forEach((e) => document.addEventListener(e, alInteractuar, { capture: true }));
      destroyRef.onDestroy(() => {
        quitar();
        this.audio?.pause();
      });
    });
  }

  protected alternar(): void {
    if (!this.audio) return;
    if (this.audio.paused) {
      this.pausadoPorPersona = false;
      this.reproducir();
    } else {
      this.pausadoPorPersona = true;
      this.audio.pause();
    }
  }

  private reproducir(): void {
    const intento = this.audio?.play();
    intento?.catch?.(() => this.sonando.set(false));
  }
}

function olvidarPausaAnterior(): void {
  try {
    localStorage.removeItem(CLAVE_PAUSA_ANTERIOR);
  } catch {
  }
}
