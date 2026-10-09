import { Component } from '@angular/core';
import { MORICHAL_CONFIG } from '../../core/morichal.config';

@Component({
  selector: 'app-comunidad-signal',
  template: `
    <a class="flotante" [href]="enlace" target="_blank" rel="noopener noreferrer" aria-label="Únete a la comunidad en Signal">
      <span class="icono">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 4.2c-4.4 0-7.9 3.2-7.9 7.2 0 1.5.5 2.9 1.4 4.1l-.9 3.3 3.5-.8c1.1.6 2.5 1 3.9 1 4.4 0 7.9-3.2 7.9-7.2S16.4 4.2 12 4.2z"
          />
        </svg>
      </span>
      <span class="texto">Únete</span>
    </a>
  `,
  styles: `
    .flotante {
      position: fixed;
      right: 1rem;
      bottom: 1rem;
      z-index: 50;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      text-decoration: none;
    }
    .texto {
      background: #fff;
      color: var(--tinta);
      font: 700 0.85rem var(--sans);
      padding: 0.2rem 0.7rem;
      border-radius: 999px;
      box-shadow: 0 4px 14px rgb(0 0 0 / 0.18);
    }
    .icono {
      display: grid;
      place-items: center;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      background: #3a76f0;
      box-shadow: 0 4px 14px rgb(0 0 0 / 0.25);
      transition: transform 0.2s;
    }
    .icono svg { width: 1.9rem; fill: #fff; }
    .flotante:hover .icono { transform: scale(1.07); }
    @media (max-width: 480px) {
      .icono { width: 3rem; height: 3rem; }
    }
  `,
})
export class ComunidadSignal {
  protected readonly enlace = MORICHAL_CONFIG.signalGrupo;
}
