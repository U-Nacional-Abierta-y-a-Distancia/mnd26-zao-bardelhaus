import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

interface Testimonio {
  nombre: string;
  foto: string;
  youtubeId: string;
}

const TESTIMONIOS: Testimonio[] = [
  { nombre: 'Vecina de la vereda', foto: 'img/testimonios/vecina-1.jpg', youtubeId: 'tRESUCQCUQA' },
  { nombre: 'Vecino de la vereda', foto: 'img/testimonios/vecino-2.jpg', youtubeId: '3AW4OdM1e9w' },
];

@Component({
  selector: 'app-testimonios',
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.css',
})
export class Testimonios {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly ventana = viewChild.required<ElementRef<HTMLDialogElement>>('ventana');

  protected readonly testimonios = TESTIMONIOS;
  protected readonly abierto = signal<Testimonio | null>(null);

  protected readonly video = computed(() => {
    const t = this.abierto();
    return t
      ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube-nocookie.com/embed/${encodeURIComponent(t.youtubeId)}?autoplay=1&rel=0`,
        )
      : null;
  });

  protected abrir(t: Testimonio): void {
    this.abierto.set(t);
    this.ventana().nativeElement.showModal();
  }

  protected cerrar(): void {
    this.ventana().nativeElement.close();
  }

  protected alCerrar(): void {
    this.abierto.set(null);
  }

  protected clicFondo(ev: MouseEvent): void {
    if (ev.target === this.ventana().nativeElement) this.cerrar();
  }
}
