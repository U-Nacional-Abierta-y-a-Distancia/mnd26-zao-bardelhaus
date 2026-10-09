import { TestBed } from '@angular/core/testing';
import { rutaDesdeHash } from '../../core/morichal.config';
import { ConoceMiCasa } from './conoce-mi-casa';

describe('rutaDesdeHash', () => {
  it('reconoce las rutas del carrusel y de las secciones', () => {
    expect(rutaDesdeHash('#casa')).toEqual({ seccion: 'casa', diapositiva: 0 });
    expect(rutaDesdeHash('#agua')).toEqual({ seccion: 'casa', diapositiva: 1 });
    expect(rutaDesdeHash('#AGUA')).toEqual({ seccion: 'casa', diapositiva: 1 });
    expect(rutaDesdeHash('#separar')).toEqual({ seccion: 'casa', diapositiva: 2 });
    expect(rutaDesdeHash('#guardian')).toEqual({ seccion: 'guardian' });
    expect(rutaDesdeHash('#otra-cosa')).toBeNull();
    expect(rutaDesdeHash('')).toBeNull();
  });
});

describe('ConoceMiCasa · carrusel', () => {
  const activa = (el: HTMLElement) => el.querySelector('.diapositiva.activa')?.getAttribute('aria-label');

  beforeEach(() => {
    history.replaceState(null, '', '#');
    TestBed.configureTestingModule({ imports: [ConoceMiCasa] });
  });

  it('en el Genially no hay flecha a la derecha: se avanza con el enlace #agua de su última pantalla', async () => {
    const fixture = TestBed.createComponent(ConoceMiCasa);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const siguiente = () => el.querySelector('.flecha.siguiente') as HTMLButtonElement | null;
    expect(activa(el)).toContain('1 de 4');
    expect(el.querySelector('iframe')?.getAttribute('src')).toContain('view.genially.com');
    expect(siguiente()).toBeNull();

    history.replaceState(null, '', '#agua');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await fixture.whenStable();
    expect(activa(el)).toContain('2 de 4: Lo que el agua ya no alcanza a lavar');

    expect(siguiente()?.classList).not.toContain('oculta');
    siguiente()!.click();
    await fixture.whenStable();
    expect(activa(el)).toContain('3 de 4');
    expect(location.hash).toBe('#separar');

    (el.querySelector('.flecha.anterior') as HTMLButtonElement).click();
    (el.querySelector('.flecha.anterior') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(activa(el)).toContain('1 de 4');
    expect(siguiente()).toBeNull();
  });

  it('se mueve cuando cambia el # (por ejemplo, desde un enlace del Genially)', async () => {
    const fixture = TestBed.createComponent(ConoceMiCasa);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    history.replaceState(null, '', '#agua');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await fixture.whenStable();
    expect(activa(el)).toContain('2 de 4');

    history.replaceState(null, '', '#casa');
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    await fixture.whenStable();
    expect(activa(el)).toContain('1 de 4');
  });

  it('abre directo en la escena del agua si la página carga con #agua', async () => {
    history.replaceState(null, '', '#agua');
    const fixture = TestBed.createComponent(ConoceMiCasa);
    await fixture.whenStable();
    expect(activa(fixture.nativeElement)).toContain('2 de 4');
  });

  it('la tercera diapositiva es "No es que no te importe" y el oso explica cada forma de separar', async () => {
    history.replaceState(null, '', '#separar');
    const fixture = TestBed.createComponent(ConoceMiCasa);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(activa(el)).toContain('3 de 4: No es que no te importe');

    const voz = () => el.querySelector('#separar-voz')?.textContent?.replace(/\s+/g, ' ').trim();
    expect(voz()).toContain('Lo orgánico, a la compostera');
    (el.querySelectorAll('.destino')[1] as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(voz()).toContain('Lo reciclable, al punto de acopio');
    expect(el.querySelectorAll('.destino')[1].getAttribute('aria-pressed')).toBe('true');
  });

  it('el globo inicial de "No es que no te importe" recorre sus 3 frases sin salir del globo', async () => {
    history.replaceState(null, '', '#separar');
    const fixture = TestBed.createComponent(ConoceMiCasa);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const frase = () => el.querySelector('.frase')?.textContent?.trim();
    const [anterior, siguiente] = el.querySelectorAll<HTMLButtonElement>('.paso');

    expect(frase()).toContain('Lo sé');
    expect(anterior.getAttribute('aria-disabled')).toBe('true');
    siguiente.click();
    await fixture.whenStable();
    expect(frase()).toContain('El problema no es solo de cada casa');
    siguiente.click();
    await fixture.whenStable();
    expect(frase()).toContain('La más poderosa es separar en casa');
    expect(siguiente.getAttribute('aria-disabled')).toBe('true');
    siguiente.click();
    anterior.click();
    await fixture.whenStable();
    expect(frase()).toContain('El problema no es solo de cada casa');
    expect(el.querySelectorAll('app-escena-separar app-dialogo-oso').length).toBe(2);
  });
});
