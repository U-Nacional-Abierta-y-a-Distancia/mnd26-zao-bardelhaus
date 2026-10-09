export type SeccionLanding = 'casa' | 'estado' | 'guardian';

export const RUTAS_HASH: Record<string, { seccion: SeccionLanding; diapositiva?: number }> = {
  casa: { seccion: 'casa', diapositiva: 0 },
  agua: { seccion: 'casa', diapositiva: 1 },
  separar: { seccion: 'casa', diapositiva: 2 },
  'te-toca': { seccion: 'casa', diapositiva: 3 },
  estado: { seccion: 'estado' },
  guardian: { seccion: 'guardian' },
};

export function rutaDesdeHash(hash = location.hash) {
  return RUTAS_HASH[decodeURIComponent(hash.replace(/^#/, '')).toLowerCase()] ?? null;
}

export const MORICHAL_CONFIG = {
  signalGrupo: 'https://signal.group/#CjQKINuKRFxYUYGNcMBelKnGprwMtHq0mmKn95lPSfRrC7WrEhCb5xjs9zqBCBg-lOZdJ7rn',
  metaHogares: 40,
  /** Vacío = mismo dominio que la página (en desarrollo, proxy.conf.json reenvía /api al backend). */
  apiBase: '',
  musicaAmbiente: 'audios/ambiente-bosque.mp3',
  geniallyUrl: 'https://view.genially.com/6ac698feb581a4ba4ea1ccea',
} as const;
