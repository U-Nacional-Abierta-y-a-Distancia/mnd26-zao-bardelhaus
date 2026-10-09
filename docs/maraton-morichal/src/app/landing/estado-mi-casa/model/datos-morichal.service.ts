import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MORICHAL_CONFIG } from '../../../core/morichal.config';
import { DatoMorichalRespuesta } from './dato-morichal';

@Injectable({ providedIn: 'root' })
export class DatosMorichalService {
  private readonly http = inject(HttpClient);
  private readonly url = `${MORICHAL_CONFIG.apiBase}/api/datos-morichal`;

  obtenerDatos(): Observable<DatoMorichalRespuesta[]> {
    return this.http.get<DatoMorichalRespuesta[]>(this.url);
  }
}
