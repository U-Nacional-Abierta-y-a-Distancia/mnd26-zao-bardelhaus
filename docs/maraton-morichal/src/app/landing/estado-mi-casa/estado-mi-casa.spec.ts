import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MORICHAL_CONFIG } from '../../core/morichal.config';
import { EstadoMiCasa } from './estado-mi-casa';
import { DatoMorichalRespuesta } from './model/dato-morichal';

const url = `${MORICHAL_CONFIG.apiBase}/api/datos-morichal`;

const lectura = (valor: number, hora: string): DatoMorichalRespuesta[] => [
  { tipoMedicion: 'TEMPERATURA', tipoSensor: 'INTERNO', valor, fechaCreacion: `2026-10-07T${hora}:00` },
  { tipoMedicion: 'TEMPERATURA', tipoSensor: 'EXTERNO', valor: valor + 5, fechaCreacion: `2026-10-07T${hora}:00` },
];

describe('EstadoMiCasa · botón de recarga', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EstadoMiCasa],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('vuelve a consultar los sensores y muestra los datos nuevos; si falla, conserva los anteriores', async () => {
    const fixture = TestBed.createComponent(EstadoMiCasa);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const dentro = () => el.querySelector('.ahora b')?.textContent?.trim();
    const boton = () => el.querySelector<HTMLButtonElement>('.recargar')!;

    expect(el.querySelector('.recargar')).toBeNull();
    http.expectOne(url).flush(lectura(24, '10:00'));
    await fixture.whenStable();
    expect(el.querySelector('.etiqueta.real')?.textContent).toContain('Dato en vivo');
    expect(dentro()).toBe('24 °C');

    boton().click();
    await fixture.whenStable();
    expect(boton().classList).toContain('girando');
    boton().click();
    http.expectOne(url).flush(lectura(26.5, '11:00'));
    await fixture.whenStable();
    expect(dentro()).toBe('26,5 °C');
    expect(boton().classList).not.toContain('girando');

    boton().click();
    http.expectOne(url).flush(null, { status: 500, statusText: 'Error' });
    await fixture.whenStable();
    expect(dentro()).toBe('26,5 °C');
    expect(boton().getAttribute('aria-disabled')).toBe('false');
  });

  it('si la carga inicial falla, el botón permite reintentar', async () => {
    const fixture = TestBed.createComponent(EstadoMiCasa);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    http.expectOne(url).flush(null, { status: 0, statusText: 'Sin conexión' });
    await fixture.whenStable();
    expect(el.querySelector('.vacio')?.textContent).toContain('No pudimos conectar');

    el.querySelector<HTMLButtonElement>('.recargar')!.click();
    http.expectOne(url).flush(lectura(23, '09:00'));
    await fixture.whenStable();
    expect(el.querySelector('.vacio')).toBeNull();
    expect(el.querySelector('.etiqueta.real')).not.toBeNull();
  });
});
