import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MORICHAL_CONFIG } from '../../../core/morichal.config';
import { PATRON_DIRECCION, RegistroHogarService } from './registro-hogar.service';

describe('RegistroHogarService', () => {
  it('envía POST a /api/registrar-hogar con el cuerpo de RegistroHogarRequest', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const servicio = TestBed.inject(RegistroHogarService);
    const http = TestBed.inject(HttpTestingController);

    let ok = false;
    servicio.registrar({ referenciaCasa: 'Junto a la tienda', compromiso: [1, 3] }).subscribe(() => (ok = true));

    const req = http.expectOne(`${MORICHAL_CONFIG.apiBase}/api/registrar-hogar`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ referenciaCasa: 'Junto a la tienda', compromiso: [1, 3] });
    req.flush(null, { status: 201, statusText: 'Created' });
    expect(ok).toBe(true);
    http.verify();
  });
});

describe('PATRON_DIRECCION', () => {
  it('acepta lo mismo que ConstantesPatrones.DIRECCION', () => {
    expect(PATRON_DIRECCION.test('Calle 3 # 4-12 cerca_de la Ñ')).toBe(true);
    expect(PATRON_DIRECCION.test('cerca de la entrada, junto a la tienda')).toBe(false);
  });
});
