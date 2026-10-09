import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MORICHAL_CONFIG } from '../../core/morichal.config';
import { SerGuardian } from './ser-guardian';
import { RegistroHogaresRespuesta } from './servicios/registro-hogar.service';

const api = `${MORICHAL_CONFIG.apiBase}/api`;

const ENUM_BACKEND = [
  'No quemar basura',
  'No botar nada al morichal ni a su orilla',
  'Separar la basura de casa',
  'Hacer compost con los residuos orgánicos',
  'Participar en la jornada de limpieza',
  'Llevar reciclables al punto de acopio',
];

const respuesta = (totalCasas: number, totales: number[], descripciones = ENUM_BACKEND): RegistroHogaresRespuesta => ({
  hogares: [],
  totales: {
    totalCasas,
    porCompromiso: descripciones.map((descripcion, i) => ({ id: i + 1, descripcion, total: totales[i] ?? 0 })),
  },
});

const texto = (el: Element) => el.textContent?.replace(/\s+/g, ' ').trim();

describe('SerGuardian · tablero', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SerGuardian],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('consulta los registros al cargar el componente y pinta los totales de los 6 compromisos', async () => {
    const fixture = TestBed.createComponent(SerGuardian);
    fixture.detectChanges();

    http.expectOne(`${api}/registros-hogar`).flush(respuesta(3, [2, 3, 1, 1, 0, 2]));
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.tab-num')?.textContent).toContain('3');
    const filas = [...el.querySelectorAll('.comp-lista li')].map(texto);
    expect(filas).toEqual([
      'No quemar basura2',
      'No botar nada al morichal ni a su orilla3',
      'Separar la basura de casa1',
      'Hacer compost con los residuos orgánicos1',
      'Participar en la jornada de limpieza0',
      'Llevar reciclables al punto de acopio2',
    ]);
    expect(el.querySelectorAll('.casas svg rect').length).toBe(3);
  });

  it('el formulario muestra los compromisos que manda el backend, con sus mismos ids', async () => {
    const fixture = TestBed.createComponent(SerGuardian);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const fichas = () => [...el.querySelectorAll('.ficha-comp')].map(texto);

    expect(fichas().length).toBe(6);

    http.expectOne(`${api}/registros-hogar`).flush(respuesta(0, [], ['Uno', 'Dos', 'Tres']));
    await fixture.whenStable();
    expect(fichas()).toEqual(['1Uno', '2Dos', '3Tres']);
  });

  it('vuelve a consultar los registros después de registrar un hogar', async () => {
    const fixture = TestBed.createComponent(SerGuardian);
    fixture.detectChanges();
    http.expectOne(`${api}/registros-hogar`).flush(respuesta(0, []));
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    const checks = el.querySelectorAll<HTMLInputElement>('.ficha-comp input');
    checks[0].click();
    checks[5].click();
    const sector = el.querySelector('#sector') as HTMLInputElement;
    sector.value = 'Junto a la tienda';
    sector.dispatchEvent(new Event('input'));
    (el.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    const post = http.expectOne(`${api}/registrar-hogar`);
    expect(post.request.body).toEqual({ referenciaCasa: 'Junto a la tienda', compromiso: [1, 6] });
    post.flush(null, { status: 201, statusText: 'Created' });

    http.expectOne(`${api}/registros-hogar`).flush(respuesta(1, [1, 0, 0, 0, 0, 1]));
    await fixture.whenStable();
    expect(el.querySelector('.tab-num')?.textContent).toContain('1');
  });

  it('"Registra tu hogar" y "Reporta" están en un acordeón que se despliega al tocar su título', async () => {
    const fixture = TestBed.createComponent(SerGuardian);
    fixture.detectChanges();
    http.expectOne(`${api}/registros-hogar`).flush(respuesta(0, []));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const [registro, reporte] = el.querySelectorAll<HTMLButtonElement>('.acordeon-titulo');

    expect(texto(registro)).toBe('Registra tu hogar');
    expect(texto(reporte)).toBe('Reporta');
    expect(registro.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('#panel-registro')!.hasAttribute('inert')).toBe(true);

    registro.click();
    await fixture.whenStable();
    expect(registro.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('#panel-registro')!.hasAttribute('inert')).toBe(false);
    expect(reporte.getAttribute('aria-expanded')).toBe('false');

    reporte.click();
    registro.click();
    await fixture.whenStable();
    expect(reporte.getAttribute('aria-expanded')).toBe('true');
    expect(registro.getAttribute('aria-expanded')).toBe('false');
  });
});
