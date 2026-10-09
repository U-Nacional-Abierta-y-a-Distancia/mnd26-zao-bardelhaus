import { TestBed } from '@angular/core/testing';
import { MusicaAmbiente } from './musica-ambiente';

describe('MusicaAmbiente', () => {
  let bloqueado: boolean;
  let reproducciones: number;

  beforeEach(() => {
    localStorage.clear();
    bloqueado = true;
    reproducciones = 0;
    const proto = HTMLMediaElement.prototype as HTMLMediaElement & { _pausado?: boolean };
    Object.defineProperty(proto, 'paused', { configurable: true, get() { return this._pausado ?? true; } });
    proto.play = function (this: HTMLMediaElement & { _pausado?: boolean }) {
      if (bloqueado) return Promise.reject(new DOMException('Bloqueado', 'NotAllowedError'));
      reproducciones++;
      this._pausado = false;
      this.dispatchEvent(new Event('play'));
      return Promise.resolve();
    };
    proto.pause = function (this: HTMLMediaElement & { _pausado?: boolean }) {
      this._pausado = true;
      this.dispatchEvent(new Event('pause'));
    };
    TestBed.configureTestingModule({ imports: [MusicaAmbiente] });
  });

  const boton = (el: HTMLElement) => el.querySelector<HTMLButtonElement>('.sonido')!;

  it('si el navegador bloquea el sonido al cargar, empieza con la primera interacción en la página', async () => {
    const fixture = TestBed.createComponent(MusicaAmbiente);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(boton(el).getAttribute('aria-pressed')).toBe('false');

    bloqueado = false;
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await fixture.whenStable();
    expect(reproducciones).toBe(1);
    expect(boton(el).getAttribute('aria-pressed')).toBe('true');
    expect(boton(el).getAttribute('aria-label')).toContain('Pausar');
  });

  it('el botón pausa durante la visita, pero en la siguiente visita vuelve a sonar por defecto', async () => {
    localStorage.setItem('morichal-sonido-pausado', '1');
    bloqueado = false;
    const fixture = TestBed.createComponent(MusicaAmbiente);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(boton(el).getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem('morichal-sonido-pausado')).toBeNull();

    boton(el).click();
    await fixture.whenStable();
    expect(boton(el).getAttribute('aria-pressed')).toBe('false');
    expect(localStorage.length).toBe(0);

    fixture.destroy();
    reproducciones = 0;
    const otra = TestBed.createComponent(MusicaAmbiente);
    await otra.whenStable();
    expect(reproducciones).toBe(1);
    expect(boton(otra.nativeElement).getAttribute('aria-pressed')).toBe('true');
  });
});
