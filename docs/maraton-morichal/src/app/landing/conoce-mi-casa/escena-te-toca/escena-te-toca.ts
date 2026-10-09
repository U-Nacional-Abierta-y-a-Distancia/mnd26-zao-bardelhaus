import { afterNextRender, Component, computed, ElementRef, Injector, inject, signal, viewChild } from '@angular/core';
import { DialogoOso } from '../dialogo-oso/dialogo-oso';

interface Opcion {
  texto: string;
  correcta: boolean;
  respuesta: string;
}

interface Pregunta {
  tema: string;
  pregunta: string;
  opciones: Opcion[];
}

const PREGUNTAS: Pregunta[] = [
  {
    tema: 'Ahora tú',
    pregunta: 'Tienes una bolsa de basura en la mano. ¿Qué haces?',
    opciones: [
      {
        texto: 'La dejo en la orilla del morichal',
        correcta: false,
        respuesta:
          'Esa noche los caballos la rompen buscando comida. Con la siguiente lluvia, lo que quedó regado baja al agua. Yo lo huelo primero: el agua que me queda para el verano ya no está limpia.',
      },
      {
        texto: 'La quemo en el patio',
        correcta: false,
        respuesta:
          'El plástico quemado suelta humo tóxico que respiran tu familia y tus vecinos. Y en temporada seca, una chispa puede llegar al morichal. Quemar basura además está prohibido en Colombia.',
      },
      {
        texto: 'La separo en casa',
        correcta: true,
        respuesta:
          'Las cáscaras se vuelven abono. El plástico y el cartón esperan limpios en el punto de acopio. Lo que de verdad hay que sacar cabe en una bolsa mucho más pequeña. Al morichal no le llega nada. ¡Eso es ser guardián!',
      },
    ],
  },
  {
    tema: 'Lo que el agua ya no alcanza a lavar',
    pregunta: 'Llega el verano con El Niño y el agua del morichal baja. ¿Qué pasa con la basura que ya estaba ahí?',
    opciones: [
      {
        texto: 'El agua se la lleva y desaparece',
        correcta: false,
        respuesta: 'Ojalá. Pero con tan poca agua nada se mueve: la basura se queda ahí, cada vez más cerca de lo que tomamos.',
      },
      {
        texto: 'Queda más concentrada en la poca agua que queda',
        correcta: true,
        respuesta:
          '¡Exacto! La basura es la misma, pero hay menos agua. Por eso en plena sequía el agua que tomamos los animales es la más sucia.',
      },
      {
        texto: 'No cambia nada, sigue igual que en invierno',
        correcta: false,
        respuesta: 'La basura sí es la misma, pero el agua no. Con menos agua, lo que botamos queda mucho más concentrado.',
      },
    ],
  },
  {
    tema: 'No es que no te importe',
    pregunta: 'Te quedaron cáscaras de plátano y restos de comida. ¿A dónde van?',
    opciones: [
      {
        texto: 'A la compostera',
        correcta: true,
        respuesta: '¡Muy bien! Se convierten en abono para la huerta o el patio. Y ni siquiera tienen que salir de tu casa.',
      },
      {
        texto: 'Al punto de acopio',
        correcta: false,
        respuesta: 'El punto de acopio es para lo reciclable: plástico, cartón, vidrio y latas. Lo orgánico va a la compostera.',
      },
      {
        texto: 'En la bolsa para el casco urbano',
        correcta: false,
        respuesta: 'Se puede aprovechar mejor: en la compostera se vuelve abono y la bolsa que sale de la vereda es más pequeña.',
      },
    ],
  },
  {
    tema: 'No es que no te importe',
    pregunta: 'Tienes botellas plásticas y latas, limpias y secas. ¿A dónde van?',
    opciones: [
      {
        texto: 'A la compostera',
        correcta: false,
        respuesta: 'El plástico y las latas no se vuelven abono. Van limpios y secos al punto de acopio.',
      },
      {
        texto: 'Al punto de acopio de la vereda',
        correcta: true,
        respuesta: '¡Eso! Desde ahí se entregan a los recicladores. Lo que se recicla no termina en mi casa.',
      },
      {
        texto: 'Al fuego, para que no ocupen espacio',
        correcta: false,
        respuesta: 'Nada al fuego: el humo del plástico es tóxico y una chispa puede llegar al morichal. Van al punto de acopio.',
      },
    ],
  },
];

@Component({
  selector: 'app-escena-te-toca',
  imports: [DialogoOso],
  templateUrl: './escena-te-toca.html',
  styleUrl: './escena-te-toca.css',
})
export class EscenaTeToca {
  protected readonly preguntas = PREGUNTAS;
  protected readonly indice = signal(0);
  protected readonly elegidas = signal<(number | null)[]>(PREGUNTAS.map(() => null));
  protected readonly retroAbierta = signal(false);
  private readonly retro = viewChild<ElementRef<HTMLDialogElement>>('retro');
  private readonly injector = inject(Injector);

  protected readonly terminado = computed(() => this.indice() >= PREGUNTAS.length);
  protected readonly pregunta = computed(() => PREGUNTAS[Math.min(this.indice(), PREGUNTAS.length - 1)]);
  protected readonly elegida = computed(() => this.elegidas()[this.indice()] ?? null);
  protected readonly respuesta = computed(() => {
    const i = this.elegida();
    return i == null ? null : this.pregunta().opciones[i];
  });
  protected readonly esUltima = computed(() => this.indice() === PREGUNTAS.length - 1);
  protected readonly aciertos = computed(
    () => this.elegidas().filter((e, i) => e != null && PREGUNTAS[i].opciones[e].correcta).length,
  );

  protected elegir(opcion: number): void {
    if (this.elegida() != null) return;
    this.elegidas.update((lista) => lista.map((e, i) => (i === this.indice() ? opcion : e)));
    this.retroAbierta.set(true);
    afterNextRender(() => this.retro()?.nativeElement.showModal(), { injector: this.injector });
  }

  protected cerrarRetro(): void {
    this.retro()?.nativeElement.close();
  }

  protected siguiente(): void {
    this.cerrarRetro();
    this.indice.update((i) => i + 1);
  }

  protected reiniciar(): void {
    this.elegidas.set(PREGUNTAS.map(() => null));
    this.indice.set(0);
  }
}
