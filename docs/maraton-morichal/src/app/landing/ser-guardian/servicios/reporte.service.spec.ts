import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { MORICHAL_CONFIG } from '../../../core/morichal.config';
import { archivoABase64, ReporteService } from './reporte.service';

describe('ReporteService', () => {
  let servicio: ReporteService;
  let http: HttpTestingController;
  const url = `${MORICHAL_CONFIG.apiBase}/api/registrar-reporte`;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(ReporteService);
    http = TestBed.inject(HttpTestingController);
  });

  it('envía el reporte sin evidencia como null', async () => {
    const envio = firstValueFrom(servicio.registrar({ donde: 'Orilla norte', descripcion: 'Bolsas', evidencia: null }));
    await Promise.resolve();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ donde: 'Orilla norte', descripcion: 'Bolsas', evidencia: null });
    req.flush(null, { status: 201, statusText: 'Created' });
    await envio;
    http.verify();
  });

  it('convierte la foto a base64 puro antes de enviarla', async () => {
    const foto = new File([new Uint8Array([1, 2, 3])], 'foto.png', { type: 'image/png' });
    const envio = firstValueFrom(servicio.registrar({ donde: 'Orilla', descripcion: 'Quema', evidencia: foto }));
    await new Promise((r) => setTimeout(r, 50));
    const req = http.expectOne(url);
    expect(req.request.body.evidencia).toBe('AQID');
    req.flush(null, { status: 201, statusText: 'Created' });
    await envio;
  });
});

describe('archivoABase64', () => {
  it('quita el prefijo data: del resultado', async () => {
    expect(await archivoABase64(new Blob(['hola']))).toBe('aG9sYQ==');
  });
});
