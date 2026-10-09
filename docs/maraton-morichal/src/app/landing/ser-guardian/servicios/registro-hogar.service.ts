import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MORICHAL_CONFIG } from '../../../core/morichal.config';

export interface RegistroHogarRequest {
  referenciaCasa: string;
  compromiso: number[];
}

export interface RegistroHogaresRespuesta {
  hogares: HogarRespuesta[];
  totales: TotalesRespuesta;
}

export interface HogarRespuesta {
  referenciaHogar: string;
  compromisos: number[];
}

export interface TotalesRespuesta {
  totalCasas: number;
  porCompromiso: TotalCompromisoRespuesta[];
}

export interface TotalCompromisoRespuesta {
  id: number;
  descripcion: string;
  total: number;
}

export const PATRON_DIRECCION = /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ#_ -]+$/;
export const PATRON_DIRECCION_MENSAJE = 'solo admite letras, números, #, -, _ y espacios';

@Injectable({ providedIn: 'root' })
export class RegistroHogarService {
  private readonly http = inject(HttpClient);
  private readonly api = `${MORICHAL_CONFIG.apiBase}/api`;

  registrar(request: RegistroHogarRequest): Observable<void> {
    return this.http.post<void>(`${this.api}/registrar-hogar`, request);
  }

  obtenerRegistros(): Observable<RegistroHogaresRespuesta> {
    return this.http.get<RegistroHogaresRespuesta>(`${this.api}/registros-hogar`);
  }
}
