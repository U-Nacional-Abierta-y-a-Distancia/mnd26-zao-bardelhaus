import { Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MORICHAL_CONFIG } from '../../core/morichal.config';
import {
  PATRON_DIRECCION,
  PATRON_DIRECCION_MENSAJE,
  RegistroHogarService,
  TotalesRespuesta,
} from './servicios/registro-hogar.service';
import { LIMITES_REPORTE, NuevoReporte, ReporteService } from './servicios/reporte.service';

const COMPROMISOS_RESPALDO: { id: number; texto: string }[] = [
  { id: 1, texto: 'No quemar basura' },
  { id: 2, texto: 'No botar nada al morichal ni a su orilla' },
  { id: 3, texto: 'Separar la basura de casa' },
  { id: 4, texto: 'Hacer compost con los residuos orgánicos' },
  { id: 5, texto: 'Participar en la jornada de limpieza' },
  { id: 6, texto: 'Llevar reciclables al punto de acopio' },
];

@Component({
  selector: 'app-ser-guardian',
  templateUrl: './ser-guardian.html',
  styleUrl: './ser-guardian.css',
})
export class SerGuardian implements OnInit, OnDestroy {
  private readonly registroHogar = inject(RegistroHogarService);
  private readonly reportes = inject(ReporteService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly totales = signal<TotalesRespuesta | null>(null);

  protected readonly compromisos = computed(() => {
    const delBackend = this.totales()?.porCompromiso;
    return delBackend?.length
      ? [...delBackend].sort((a, b) => a.id - b.id).map((c) => ({ id: c.id, texto: c.descripcion }))
      : COMPROMISOS_RESPALDO;
  });
  protected readonly cargandoTablero = signal(true);
  protected readonly totalCasas = computed(() => this.totales()?.totalCasas ?? 0);
  protected readonly meta = computed(() => Math.max(MORICHAL_CONFIG.metaHogares, this.totalCasas()));
  protected readonly porcentaje = computed(() => {
    const meta = this.meta();
    return meta ? Math.min(100, (this.totalCasas() / meta) * 100) : 0;
  });
  protected readonly casas = computed(() => Array.from({ length: this.meta() }, (_, i) => i < this.totalCasas()));
  protected readonly desglose = computed(() => {
    const totales = this.totales();
    const casas = totales?.totalCasas ?? 0;
    const porId = new Map((totales?.porCompromiso ?? []).map((c) => [c.id, c.total]));
    return this.compromisos().map((c) => {
      const total = porId.get(c.id) ?? 0;
      return { id: c.id, descripcion: c.texto, total, ancho: casas ? Math.min(100, (total / casas) * 100) : 0 };
    });
  });

  protected readonly elegidos = signal<Set<number>>(new Set());
  protected readonly sector = signal('');
  protected readonly errorCompromiso = signal('');
  protected readonly errorSector = signal('');
  protected readonly estadoRegistro = signal('');
  protected readonly enviandoRegistro = signal(false);
  protected readonly registroAbierto = signal(false);
  protected readonly reporteAbierto = signal(false);

  protected readonly punto = signal('');
  protected readonly detalle = signal('');
  protected readonly errorPunto = signal('');
  protected readonly errorDetalle = signal('');
  protected readonly errorFoto = signal('');
  protected readonly estadoReporte = signal('');
  protected readonly enviandoReporte = signal(false);
  protected readonly foto = signal<File | null>(null);
  protected readonly fotoUrl = signal<string | null>(null);
  protected readonly limites = LIMITES_REPORTE;

  ngOnInit(): void {
    this.cargarTablero();
  }

  private cargarTablero(): void {
    this.registroHogar
      .obtenerRegistros()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (r) => {
          this.totales.set(r.totales);
          this.cargandoTablero.set(false);
        },
        error: () => this.cargandoTablero.set(false),
      });
  }

  protected alternar(id: number, marcado: boolean): void {
    this.elegidos.update((s) => {
      const nuevo = new Set(s);
      marcado ? nuevo.add(id) : nuevo.delete(id);
      return nuevo;
    });
    this.errorCompromiso.set('');
  }

  protected registrar(ev: Event): void {
    ev.preventDefault();
    if (this.enviandoRegistro()) return;
    this.estadoRegistro.set('');

    const elegidos = [...this.elegidos()];
    const referencia = this.sector().trim();
    if (!elegidos.length) this.errorCompromiso.set('Elige al menos un compromiso.');
    if (!referencia) {
      this.errorSector.set('Escribe un sector o punto de referencia de tu casa.');
    } else if (!PATRON_DIRECCION.test(referencia)) {
      this.errorSector.set(`La referencia de la casa ${PATRON_DIRECCION_MENSAJE}.`);
    }
    if (this.errorCompromiso() || this.errorSector()) return;

    this.enviandoRegistro.set(true);
    this.registroHogar
      .registrar({
        referenciaCasa: referencia,
        compromiso: elegidos.sort((a, b) => a - b),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.cargarTablero();
          this.elegidos.set(new Set());
          this.sector.set('');
          this.enviandoRegistro.set(false);
          this.estadoRegistro.set('¡Tu casa ya se encendió en el tablero! Gracias por cuidar el morichal.');
        },
        error: () => this.enviandoRegistro.set(false),
      });
  }

  protected elegirFoto(input: HTMLInputElement): void {
    const archivo = input.files?.[0] ?? null;
    this.errorFoto.set('');
    if (archivo && !archivo.type.startsWith('image/')) {
      input.value = '';
      this.errorFoto.set('El archivo debe ser una imagen.');
      return;
    }
    if (archivo && archivo.size > LIMITES_REPORTE.evidenciaBytes) {
      input.value = '';
      this.errorFoto.set('La foto no puede superar 5 MB.');
      return;
    }
    this.cambiarFoto(archivo);
  }

  protected quitarFoto(input: HTMLInputElement): void {
    input.value = '';
    this.errorFoto.set('');
    this.cambiarFoto(null);
  }

  private cambiarFoto(archivo: File | null): void {
    const anterior = this.fotoUrl();
    if (anterior) URL.revokeObjectURL(anterior);
    this.foto.set(archivo);
    this.fotoUrl.set(archivo ? URL.createObjectURL(archivo) : null);
  }

  protected reportar(ev: Event, fotoInput: HTMLInputElement): void {
    ev.preventDefault();
    if (this.enviandoReporte()) return;
    this.estadoReporte.set('');

    const donde = this.punto().trim();
    const descripcion = this.detalle().trim();
    if (!donde) this.errorPunto.set('Escribe dónde la viste.');
    else if (donde.length > LIMITES_REPORTE.donde) this.errorPunto.set(`Máximo ${LIMITES_REPORTE.donde} caracteres.`);
    if (!descripcion) this.errorDetalle.set('Cuéntanos qué viste.');
    else if (descripcion.length > LIMITES_REPORTE.descripcion) this.errorDetalle.set(`Máximo ${LIMITES_REPORTE.descripcion} caracteres.`);
    if (this.errorPunto() || this.errorDetalle() || this.errorFoto()) return;

    const reporte: NuevoReporte = { donde, descripcion, evidencia: this.foto() };
    this.enviandoReporte.set(true);
    this.reportes
      .registrar(reporte)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.enviandoReporte.set(false);
          this.punto.set('');
          this.detalle.set('');
          fotoInput.value = '';
          this.cambiarFoto(null);
          this.estadoReporte.set('¡Reporte enviado! Llegará al grupo de Signal de la vereda. Gracias por cuidar el morichal.');
        },
        error: () => this.enviandoReporte.set(false),
      });
  }

  ngOnDestroy(): void {
    const url = this.fotoUrl();
    if (url) URL.revokeObjectURL(url);
  }
}
