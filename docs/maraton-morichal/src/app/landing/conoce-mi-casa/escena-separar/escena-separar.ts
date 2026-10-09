import { Component, computed, signal } from '@angular/core';
import { DialogoOso } from '../dialogo-oso/dialogo-oso';
import { Testimonios } from '../testimonios/testimonios';

interface Destino {
  numero: number;
  titulo: string;
  detalle: string;
  color: string;
}

const DESTINOS: Destino[] = [
  {
    numero: 1,
    titulo: 'Lo orgánico, a la compostera',
    detalle: 'Cáscaras, restos de comida y hojas. Se convierten en abono para la huerta o el patio. No salen de tu casa.',
    color: 'var(--hoja)',
  },
  {
    numero: 2,
    titulo: 'Lo reciclable, al punto de acopio',
    detalle:
      'Plástico, cartón, vidrio y latas, limpios y secos. Se llevan al punto de acopio de la vereda para entregarlos a los recicladores.',
    color: 'var(--sabana)',
  },
  {
    numero: 3,
    titulo: 'Lo demás, bien cerrado',
    detalle:
      'Lo que no se aprovecha va en bolsa cerrada, lejos del agua y donde los animales no lleguen, hasta sacarlo al casco urbano.',
    color: '#b59a85',
  },
];

const FRASES = [
  'Lo sé: el carro de la basura solo pasa por la vereda una vez a la semana. Las bolsas se acumulan y uno no sabe qué hacer con ellas como lo expresan algunos vecinos.',
  'El problema no es solo de cada casa. Es que la vereda creció y el servicio no llegó. Pero mientras se resuelve, hay cosas que sí están en nuestras manos, y que hacen que mucha menos basura termine en el morichal.',
  'La más poderosa es separar en casa. Así, mucho menos tiene que salir de la vereda y nada tiene por qué llegar al agua. Toca cada una para saber a dónde va.',
];

@Component({
  selector: 'app-escena-separar',
  imports: [DialogoOso, Testimonios],
  templateUrl: './escena-separar.html',
  styleUrl: './escena-separar.css',
})
export class EscenaSeparar {
  protected readonly frases = FRASES;
  protected readonly indice = signal(0);
  protected readonly frase = computed(() => FRASES[this.indice()]);

  protected mover(paso: number): void {
    this.indice.update((i) => Math.max(0, Math.min(FRASES.length - 1, i + paso)));
  }

  protected readonly destinos = DESTINOS;
  protected readonly elegido = signal(0);
  protected readonly destino = computed(() => DESTINOS[this.elegido()]);
}
