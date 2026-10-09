import { TestBed } from '@angular/core/testing';
import { EscenaAgua } from './escena-agua';

describe('EscenaAgua · conclusión', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [EscenaAgua] }));

  it('el botón aparece con la primera interacción con la época del año y abre la conclusión arriba a la derecha', async () => {
    const fixture = TestBed.createComponent(EscenaAgua);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const boton = () => el.querySelector<HTMLButtonElement>('.ver-conclusion');
    const ventana = () => el.querySelector('.panel .conclusion');

    expect(boton()).toBeNull();
    expect(ventana()).toBeNull();

    const control = el.querySelector<HTMLInputElement>('#nivel')!;
    control.value = '2';
    control.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(boton()).not.toBeNull();
    expect(boton()!.getAttribute('aria-expanded')).toBe('false');

    boton()!.click();
    await fixture.whenStable();
    expect(ventana()?.textContent).toContain('La basura no cambió');
    expect(boton()!.getAttribute('aria-expanded')).toBe('true');

    el.querySelector<HTMLButtonElement>('.conclusion .cerrar')!.click();
    await fixture.whenStable();
    expect(ventana()).toBeNull();
  });
});
