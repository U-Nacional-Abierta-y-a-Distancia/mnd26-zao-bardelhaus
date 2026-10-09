import { HttpClient, HttpContext, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { errorInterceptor, SIN_AVISO_DE_ERROR } from './error.interceptor';
import { mensajeDeError } from './mensaje-error';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let notificaciones: NotificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
    notificaciones = TestBed.inject(NotificacionesService);
  });

  it('muestra el mensaje del backend en un aviso y deja pasar el error a quien llamó', () => {
    let recibido: unknown;
    http.post('/api/x', {}).subscribe({ error: (e) => (recibido = e) });
    backend
      .expectOne('/api/x')
      .flush({ errores: ['compromiso: Debe indicar al menos un compromiso'] }, { status: 400, statusText: 'Bad Request' });

    expect(notificaciones.avisos().map((a) => a.texto)).toEqual(['Debe indicar al menos un compromiso']);
    expect(recibido).toBeInstanceOf(HttpErrorResponse);
  });

  it('no muestra aviso si la petición lleva SIN_AVISO_DE_ERROR', () => {
    http.get('/api/y', { context: new HttpContext().set(SIN_AVISO_DE_ERROR, true) }).subscribe({ error: () => {} });
    backend.expectOne('/api/y').flush(null, { status: 500, statusText: 'Error' });

    expect(notificaciones.avisos()).toEqual([]);
  });
});

describe('mensajeDeError', () => {
  it('entiende el formato { errores: ["campo: mensaje"] } del backend', () => {
    const err = new HttpErrorResponse({
      status: 400,
      error: { errores: ['compromiso: Debe indicar al menos un compromiso', 'referenciaCasa: La referencia de la casa no puede estar vacía'] },
    });
    expect(mensajeDeError(err)).toBe('Debe indicar al menos un compromiso. La referencia de la casa no puede estar vacía');
  });

  it('usa los mensajes de validación estándar de Spring', () => {
    const err = new HttpErrorResponse({ status: 400, error: { errors: [{ defaultMessage: 'Campo inválido' }] } });
    expect(mensajeDeError(err)).toBe('Campo inválido');
  });

  it('avisa cuando no hay conexión', () => {
    expect(mensajeDeError(new HttpErrorResponse({ status: 0 }))).toContain('No pudimos conectar');
  });
});
