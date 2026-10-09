import { TestBed } from '@angular/core/testing';
import { App } from './app';

const esperarHash = () => new Promise((r) => setTimeout(r, 0));

describe('App', () => {
  beforeEach(async () => {
    history.replaceState(null, '', '#');
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('muestra solo la pantalla inicial hasta elegir una opción', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('huelo todo');
    expect(compiled.querySelector('#guardian')).toBeNull();

    compiled.querySelectorAll<HTMLButtonElement>('app-inicio button')[2].click();
    await esperarHash();
    await fixture.whenStable();
    expect(location.hash).toBe('#guardian');
    expect(compiled.querySelector('#casa')).not.toBeNull();
    expect(compiled.querySelector('#estado')).not.toBeNull();
    expect(compiled.querySelector('#guardian')).not.toBeNull();
  });

  it('abre la landing directo en la escena del agua si llega con #agua (enlace desde el Genially)', async () => {
    history.replaceState(null, '', '#agua');
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.diapositiva.activa')?.getAttribute('aria-label')).toContain('2 de 4');
  });
});
