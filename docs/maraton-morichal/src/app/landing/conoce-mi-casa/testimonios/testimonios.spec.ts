import { TestBed } from '@angular/core/testing';
import { Testimonios } from './testimonios';

describe('Testimonios', () => {
  beforeEach(() => {
    const proto = HTMLDialogElement.prototype as HTMLDialogElement & Record<string, unknown>;
    proto.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    proto.close ??= function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
    TestBed.configureTestingModule({ imports: [Testimonios] });
  });

  it('cada cara abre su video de YouTube en la ventana y al cerrar se quita el video', async () => {
    const fixture = TestBed.createComponent(Testimonios);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const caras = el.querySelectorAll<HTMLButtonElement>('.cara');
    expect(caras.length).toBe(2);
    expect(el.querySelector('iframe')).toBeNull();

    caras[1].click();
    await fixture.whenStable();
    expect(el.querySelector('dialog')?.hasAttribute('open')).toBe(true);
    expect(el.querySelector('iframe')?.getAttribute('src')).toContain('youtube-nocookie.com/embed/');
    expect(el.querySelector('.cabecera p')?.textContent).toContain('Vecino de la vereda');

    (el.querySelector('.cerrar') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(el.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(el.querySelector('iframe')).toBeNull();
  });
});
