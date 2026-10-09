import { afterNextRender, Component, computed, ElementRef, Injector, inject, signal, viewChild } from '@angular/core';
import { DialogoOso } from '../dialogo-oso/dialogo-oso';

interface Etapa {
  nombre: string;
  top: number;
  agua: string;
  color: string;
  voz: string;
}

const ETAPAS: Etapa[] = [
  { nombre: 'Invierno', top: 40, agua: '100%', color: '#5B8C8A', voz: 'En invierno la esponja está llena. El agua alcanza para todos.' },
  { nombre: 'Transición', top: 90, agua: '70%', color: '#668A7C', voz: 'Empieza a bajar. Ya huelo la basura de la orilla más cerca del agua.' },
  { nombre: 'Verano', top: 140, agua: '45%', color: '#7D8A6C', voz: 'Es verano. Lo que botaron está casi encima del agua que me queda.' },
  { nombre: 'Verano con El Niño', top: 185, agua: '25%', color: '#918659', voz: 'Con El Niño casi no queda agua. Y la poca que hay huele a todo lo que botaron.' },
];

const COLORES_BASURA = ['#D9B65F', '#EDE6D6', '#C7683A'];

const IMAGENES_BASURA: string[] = [];
const TAMANO_BASURA = 26;

@Component({
  selector: 'app-escena-agua',
  imports: [DialogoOso],
  templateUrl: './escena-agua.html',
  styleUrl: './escena-agua.css',
})
export class EscenaAgua {
  protected readonly etapas = ETAPAS;
  protected readonly etapa = signal(0);
  protected readonly interactuo = signal(false);
  protected readonly conclusionAbierta = signal(false);
  private readonly injector = inject(Injector);
  private readonly botonConclusion = viewChild<ElementRef<HTMLButtonElement>>('botonConclusion');
  private readonly cerrarBoton = viewChild<ElementRef<HTMLButtonElement>>('cerrarBoton');
  protected readonly actual = computed(() => ETAPAS[this.etapa()]);

  protected readonly conImagenes = IMAGENES_BASURA.length > 0;
  protected readonly tamano = TAMANO_BASURA;

  private readonly semillas = Array.from({ length: 20 }, () => [Math.random(), Math.random(), Math.random()]);

  protected readonly residuos = computed(() => {
    const { top } = this.actual();
    const alto = 240 - top;
    const lado = this.conImagenes ? TAMANO_BASURA : 12;
    const xIni = 140 * (top / 240) + 20;
    const xFin = 600 - xIni;
    return this.semillas.map(([a, b, c], k) => ({
      x: xIni + a * (xFin - xIni - lado),
      y: top + 6 + b * Math.max(0, alto - 6 - lado),
      giro: Math.round(c * 70 - 35),
      color: COLORES_BASURA[k % 3],
      imagen: IMAGENES_BASURA[k % (IMAGENES_BASURA.length || 1)],
    }));
  });

  protected readonly concentracion = computed(() => {
    const alto = 240 - this.actual().top;
    return '×' + (Math.round((200 / alto) * 10) / 10).toString().replace('.', ',');
  });

  protected cambiarEtapa(valor: string): void {
    this.etapa.set(Number(valor));
    this.interactuo.set(true);
  }

  protected abrirConclusion(): void {
    this.conclusionAbierta.set(true);
    afterNextRender(() => this.cerrarBoton()?.nativeElement.focus(), { injector: this.injector });
  }

  protected cerrarConclusion(): void {
    this.conclusionAbierta.set(false);
    afterNextRender(() => this.botonConclusion()?.nativeElement.focus(), { injector: this.injector });
  }
}
