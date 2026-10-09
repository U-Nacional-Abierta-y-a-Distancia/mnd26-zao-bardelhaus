import { TestBed } from '@angular/core/testing';
import { rutaDesdeHash } from '../../../core/morichal.config';
import { EscenaTeToca } from './escena-te-toca';

describe('EscenaTeToca · Ahora te toca a ti', () => {
  beforeEach(() => {
    const proto = HTMLDialogElement.prototype as HTMLDialogElement & Record<string, unknown>;
    proto.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    proto.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
    TestBed.configureTestingModule({ imports: [EscenaTeToca] });
  });

  const texto = (el: Element | null) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  it('tiene su propia ruta #te-toca en el carrusel', () => {
    expect(rutaDesdeHash('#te-toca')).toEqual({ seccion: 'casa', diapositiva: 3 });
  });

  it('la retroalimentación sale en una ventana con el botón de siguiente; al final invita a ser guardián', async () => {
    const fixture = TestBed.createComponent(EscenaTeToca);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const opciones = () => el.querySelectorAll<HTMLButtonElement>('.opcion');
    const ventana = () => el.querySelector('dialog.retro')!;
    const siguienteEnVentana = () => ventana().querySelector<HTMLButtonElement>('.btn')!;

    expect(texto(el.querySelector('.tema'))).toContain('Pregunta 1 de 4');
    expect(ventana().hasAttribute('open')).toBe(false);

    opciones()[1].click();
    await fixture.whenStable();
    expect(ventana().hasAttribute('open')).toBe(true);
    expect(texto(ventana().querySelector('.veredicto'))).toContain('no tanto');
    expect(opciones()[2].classList).toContain('correcta');

    // Si cierra la ventana sin avanzar, queda un botón pequeño para seguir.
    ventana().querySelector<HTMLButtonElement>('.cerrar')!.click();
    await fixture.whenStable();
    expect(ventana().hasAttribute('open')).toBe(false);
    el.querySelector<HTMLButtonElement>('.seguir')!.click();
    await fixture.whenStable();
    expect(texto(el.querySelector('.tema'))).toContain('Pregunta 2 de 4');

    for (const correcta of [1, 0, 1]) {
      opciones()[correcta].click();
      await fixture.whenStable();
      expect(texto(ventana().querySelector('.veredicto'))).toBe('¡Bien!');
      siguienteEnVentana().click();
      await fixture.whenStable();
    }

    expect(texto(el.querySelector('.puntaje'))).toBe('3 de 4');
    expect(el.querySelector('a[href="#guardian"]')).not.toBeNull();

    el.querySelector<HTMLButtonElement>('.final .btn-borde')!.click();
    await fixture.whenStable();
    expect(texto(el.querySelector('.tema'))).toContain('Pregunta 1 de 4');
  });
});
