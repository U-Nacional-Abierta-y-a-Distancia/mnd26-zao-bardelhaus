import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { MORICHAL_CONFIG } from '../../../core/morichal.config';

export interface ReporteDto {
  donde: string;
  descripcion: string;
  evidencia: string | null;
}

export interface NuevoReporte {
  donde: string;
  descripcion: string;
  evidencia: File | null;
}

export const LIMITES_REPORTE = {
  donde: 255,
  descripcion: 2000,
  evidenciaBytes: 5 * 1024 * 1024,
} as const;

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private readonly http = inject(HttpClient);
  private readonly url = `${MORICHAL_CONFIG.apiBase}/api/registrar-reporte`;

  registrar(reporte: NuevoReporte): Observable<void> {
    const evidencia = reporte.evidencia ? archivoABase64(reporte.evidencia) : Promise.resolve(null);
    return from(evidencia).pipe(
      switchMap((base64) =>
        this.http.post<void>(this.url, {
          donde: reporte.donde,
          descripcion: reporte.descripcion,
          evidencia: base64,
        } satisfies ReporteDto),
      ),
    );
  }
}

export function archivoABase64(archivo: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result).split(',')[1] ?? '');
    lector.onerror = () => reject(lector.error);
    lector.readAsDataURL(archivo);
  });
}
