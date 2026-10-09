import { afterNextRender, Component, DestroyRef, Injector, inject, signal } from '@angular/core';
import { rutaDesdeHash, SeccionLanding } from './core/morichal.config';
import { Notificaciones } from './core/notificaciones/notificaciones';
import { ComunidadSignal } from './landing/comunidad-signal/comunidad-signal';
import { ConoceMiCasa } from './landing/conoce-mi-casa/conoce-mi-casa';
import { EstadoMiCasa } from './landing/estado-mi-casa/estado-mi-casa';
import { Inicio } from './landing/inicio/inicio';
import { MusicaAmbiente } from './landing/musica-ambiente/musica-ambiente';
import { Pie } from './landing/pie/pie';
import { SerGuardian } from './landing/ser-guardian/ser-guardian';

@Component({
  selector: 'app-root',
  imports: [Notificaciones, MusicaAmbiente, ComunidadSignal, Inicio, ConoceMiCasa, EstadoMiCasa, SerGuardian, Pie],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly injector = inject(Injector);

  protected readonly landingVisible = signal(false);

  constructor() {
    const alCambiarHash = () => this.seguirHash();
    window.addEventListener('hashchange', alCambiarHash);
    inject(DestroyRef).onDestroy(() => window.removeEventListener('hashchange', alCambiarHash));
    afterNextRender(() => this.seguirHash());
  }

  protected elegir(seccion: SeccionLanding): void {
    if (location.hash === `#${seccion}`) this.seguirHash();
    else location.hash = seccion;
  }

  private seguirHash(): void {
    const ruta = rutaDesdeHash();
    if (!ruta) return;
    this.landingVisible.set(true);
    afterNextRender(() => setTimeout(() => desplazarA(ruta.seccion), 60), { injector: this.injector });
  }
}

function desplazarA(seccion: SeccionLanding): void {
  const destino = () =>
    (seccion === 'casa' ? document.querySelector<HTMLElement>('#casa .carrusel') : null) ??
    document.getElementById(seccion);
  const bloque: ScrollLogicalPosition = seccion === 'casa' ? 'center' : 'start';
  const ir = (behavior: ScrollBehavior) => destino()?.scrollIntoView({ behavior, block: bloque });

  ir('smooth');

  let corregido = false;
  const corregir = () => {
    if (corregido) return;
    corregido = true;
    const el = destino();
    if (!el) return;
    const r = el.getBoundingClientRect();
    const desfase =
      bloque === 'center' ? Math.abs(r.top + r.height / 2 - innerHeight / 2) : Math.abs(r.top);
    const centrable = bloque === 'start' || r.height <= innerHeight;
    if (centrable && desfase > 12) ir('smooth');
  };
  addEventListener('scrollend', corregir, { once: true });
  setTimeout(corregir, 1200);
}
