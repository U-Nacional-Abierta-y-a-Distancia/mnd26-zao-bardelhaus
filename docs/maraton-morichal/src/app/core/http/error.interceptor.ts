import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { mensajeDeError } from './mensaje-error';

export const SIN_AVISO_DE_ERROR = new HttpContextToken<boolean>(() => false);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificaciones = inject(NotificacionesService);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && !req.context.get(SIN_AVISO_DE_ERROR)) {
        notificaciones.error(mensajeDeError(err));
      }
      return throwError(() => err);
    }),
  );
};
