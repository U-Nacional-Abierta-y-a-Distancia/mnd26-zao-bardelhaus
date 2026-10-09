import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { compararEnElTiempo, DatoMorichalRespuesta, TipoMedicion, ultimaLectura } from './model/dato-morichal';
import { DatosMorichalService } from './model/datos-morichal.service';

type Estado = 'cargando' | 'listo' | 'error';

interface Medida {
  tipo: TipoMedicion;
  nombre: string;
  unidad: string;
  paso: number;
}

const MEDIDAS: Medida[] = [
  { tipo: 'TEMPERATURA', nombre: 'Temperatura', unidad: '°C', paso: 2 },
  { tipo: 'HUMEDAD', nombre: 'Humedad', unidad: '%', paso: 10 },
];

const COL = { dentro: '#2F6A68', fuera: '#C7683A' };

const W = 600;
const H = 260;
const M = { l: 44, r: 20, t: 28, b: 34 };
const ANCHO_LETRA = 6.4;

const coma = (n: number) => n.toString().replace('.', ',');

@Component({
  selector: 'app-estado-mi-casa',
  templateUrl: './estado-mi-casa.html',
  styleUrl: './estado-mi-casa.css',
})
export class EstadoMiCasa implements OnInit {
  private readonly servicio = inject(DatosMorichalService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly W = W;
  protected readonly H = H;
  protected readonly M = M;
  protected readonly COL = COL;
  protected readonly medidas = MEDIDAS;
  protected readonly coma = coma;

  protected readonly datos = signal<DatoMorichalRespuesta[]>([]);
  protected readonly estado = signal<Estado>('cargando');
  protected readonly actualizando = signal(false);
  protected readonly ultimaConsulta = signal<Date | null>(null);
  protected readonly ayudaRecarga = computed(() => {
    const f = this.ultimaConsulta();
    const hora = f?.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    return hora ? `Actualizar datos (última consulta: ${hora})` : 'Actualizar datos';
  });
  protected readonly tipo = signal<TipoMedicion>('TEMPERATURA');

  protected readonly medida = computed(() => MEDIDAS.find((m) => m.tipo === this.tipo())!);
  protected readonly puntos = computed(() => compararEnElTiempo(this.datos(), this.tipo()));

  protected readonly ahora = computed(() => ({
    dentro: ultimaLectura(this.datos(), this.tipo(), 'INTERNO'),
    fuera: ultimaLectura(this.datos(), this.tipo(), 'EXTERNO'),
  }));
  protected readonly ultimaFecha = computed(() => {
    const { dentro, fuera } = this.ahora();
    const f = [dentro?.fecha, fuera?.fecha].filter((d): d is Date => !!d).sort((a, b) => b.getTime() - a.getTime())[0];
    return f?.toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  });

  private readonly escala = computed(() => {
    const ps = this.puntos();
    const paso = this.medida().paso;
    const todos = ps.flatMap((p) => [p.dentro, p.fuera]).filter((v): v is number => v != null);
    let min = Math.floor(Math.min(...todos) / paso) * paso - paso;
    let max = Math.ceil(Math.max(...todos) / paso) * paso + paso;
    if (this.tipo() === 'HUMEDAD') {
      min = Math.max(0, min);
      max = Math.min(100, max);
    }
    const x = (i: number) => (ps.length === 1 ? (M.l + W - M.r) / 2 : M.l + (i * (W - M.l - M.r)) / (ps.length - 1));
    const y = (v: number) => M.t + ((max - v) * (H - M.t - M.b)) / (max - min);
    return { min, max, paso, x, y };
  });

  protected readonly guias = computed(() => {
    const { min, max, paso, y } = this.escala();
    const lineas: { v: number; y: number }[] = [];
    for (let v = min; v <= max; v += paso) lineas.push({ v, y: y(v) });
    return lineas;
  });

  protected readonly ubicados = computed(() => {
    const { x, y } = this.escala();
    const ps = this.puntos();
    const variosDias = ps.length > 1 && ps[0].fecha.toDateString() !== ps[ps.length - 1].fecha.toDateString();
    return ps.map((p, i) => ({
      ...p,
      x: x(i),
      yDentro: p.dentro != null ? y(p.dentro) : null,
      yFuera: p.fuera != null ? y(p.fuera) : null,
      hora: p.fecha.toLocaleString(
        'es-CO',
        variosDias ? { day: 'numeric', month: 'short', hour: 'numeric' } : { hour: 'numeric', minute: '2-digit' },
      ),
    }));
  });

  protected readonly etiquetasX = computed(() => {
    const SEPARACION = 14;
    const conBordes = this.ubicados().map((p) => {
      const ancho = p.hora.length * ANCHO_LETRA;
      let anchor: 'start' | 'middle' | 'end' = 'middle';
      let izq = p.x - ancho / 2;
      if (izq < 0) [anchor, izq] = ['start', p.x];
      else if (p.x + ancho / 2 > W) [anchor, izq] = ['end', p.x - ancho];
      return { x: p.x, texto: p.hora, anchor, izq, der: izq + ancho };
    });
    const visibles: typeof conBordes = [];
    conBordes.forEach((e, i) => {
      const esUltima = i === conBordes.length - 1;
      while (esUltima && visibles.length && e.izq < visibles.at(-1)!.der + SEPARACION) visibles.pop();
      if (!visibles.length || e.izq >= visibles.at(-1)!.der + SEPARACION) visibles.push(e);
    });
    return visibles;
  });

  protected readonly lineaDentro = computed(() => this.trazo(this.ubicados().map((p) => [p.x, p.yDentro])));
  protected readonly lineaFuera = computed(() => this.trazo(this.ubicados().map((p) => [p.x, p.yFuera])));

  private readonly comparables = computed(() =>
    this.ubicados().filter((p) => p.dentro != null && p.fuera != null && p.yDentro != null && p.yFuera != null),
  );
  protected readonly hayComparacion = computed(() => this.comparables().length > 0);

  protected readonly franja = computed(() => {
    const ps = this.comparables();
    if (ps.length < 2) return '';
    const arriba = ps.map((p) => `${p.x.toFixed(1)},${p.yFuera!.toFixed(1)}`);
    const abajo = ps.map((p) => `${p.x.toFixed(1)},${p.yDentro!.toFixed(1)}`).reverse();
    return [...arriba, ...abajo].join(' ');
  });

  protected readonly mayorDiferencia = computed(() => {
    const ps = this.comparables();
    if (!ps.length) return null;
    const dif = (p: (typeof ps)[number]) => Math.abs(p.fuera! - p.dentro!);
    const p = ps.reduce((a, b) => (dif(b) > dif(a) ? b : a));
    return { hora: p.hora, dif: coma(Math.round(dif(p) * 10) / 10), menos: p.dentro! <= p.fuera! };
  });

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    if (this.actualizando()) return;
    this.actualizando.set(true);
    this.servicio
      .obtenerDatos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          this.datos.set(datos ?? []);
          this.estado.set('listo');
          this.ultimaConsulta.set(new Date());
          this.actualizando.set(false);
        },
        error: () => {
          if (!this.datos().length) this.estado.set('error');
          this.actualizando.set(false);
        },
      });
  }

  private trazo(ps: (number | null)[][]): string {
    return ps
      .filter(([, y]) => y != null)
      .map(([x, y], i) => `${i ? 'L' : 'M'}${x!.toFixed(1)},${y!.toFixed(1)}`)
      .join(' ');
  }
}
