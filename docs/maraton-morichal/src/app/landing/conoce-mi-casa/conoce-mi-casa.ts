import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MORICHAL_CONFIG, rutaDesdeHash } from '../../core/morichal.config';
import { EscenaAgua } from './escena-agua/escena-agua';
import { EscenaSeparar } from './escena-separar/escena-separar';
import { EscenaTeToca } from './escena-te-toca/escena-te-toca';

interface Diapositiva {
  hash: string;
  nombre: string;
}

const DIAPOSITIVAS: Diapositiva[] = [
  { hash: 'casa', nombre: 'Conoce mi casa' },
  { hash: 'agua', nombre: 'Lo que el agua ya no alcanza a lavar' },
  { hash: 'separar', nombre: 'No es que no te importe' },
  { hash: 'te-toca', nombre: 'Ahora te toca a ti' },
];

@Component({
  selector: 'app-conoce-mi-casa',
  imports: [EscenaAgua, EscenaSeparar, EscenaTeToca],
  templateUrl: './conoce-mi-casa.html',
  styleUrl: './conoce-mi-casa.css',
})
export class ConoceMiCasa {
  protected readonly diapositivas = DIAPOSITIVAS;
  protected readonly actual = signal(this.diapositivaDesdeHash() ?? 0);
  protected readonly alturas = signal<number[]>([]);

  protected readonly genially = inject(DomSanitizer).bypassSecurityTrustResourceUrl(MORICHAL_CONFIG.geniallyUrl);

  private readonly slides = viewChildren<ElementRef<HTMLElement>>('slide');

  constructor() {
    const destroyRef = inject(DestroyRef);

    const alCambiarHash = () => {
      const i = this.diapositivaDesdeHash();
      if (i != null) this.actual.set(i);
    };
    window.addEventListener('hashchange', alCambiarHash);
    destroyRef.onDestroy(() => window.removeEventListener('hashchange', alCambiarHash));

    afterNextRender(() => {
      const observador = new ResizeObserver(() =>
        this.alturas.set(this.slides().map((s) => s.nativeElement.offsetHeight)),
      );
      this.slides().forEach((s) => observador.observe(s.nativeElement));
      destroyRef.onDestroy(() => observador.disconnect());
    });
  }

  protected ir(i: number): void {
    const destino = Math.max(0, Math.min(DIAPOSITIVAS.length - 1, i));
    this.actual.set(destino);
    history.replaceState(null, '', `#${DIAPOSITIVAS[destino].hash}`);
  }

  protected teclado(ev: KeyboardEvent): void {
    if ((ev.target as HTMLElement).closest('input, textarea, select, dialog')) return;
    if (ev.key === 'ArrowRight') this.ir(this.actual() + 1);
    if (ev.key === 'ArrowLeft') this.ir(this.actual() - 1);
  }

  private diapositivaDesdeHash(): number | null {
    const ruta = rutaDesdeHash();
    return ruta?.seccion === 'casa' && ruta.diapositiva != null ? ruta.diapositiva : null;
  }
}
