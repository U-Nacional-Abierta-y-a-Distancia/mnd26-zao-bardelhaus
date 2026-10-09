import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(err: HttpErrorResponse): string {
  if (err.status === 0) return 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
  const cuerpo = err.error;
  if (cuerpo && typeof cuerpo === 'object') {
    const lista = cuerpo.errores ?? cuerpo.errors ?? cuerpo.fieldErrors;
    if (Array.isArray(lista)) {
      const mensajes = lista
        .map((e: unknown) =>
          typeof e === 'string' ? e : ((e as { defaultMessage?: string; message?: string })?.defaultMessage ?? (e as { message?: string })?.message),
        )
        .filter((m): m is string => !!m)
        .map((m) => m.replace(/^\w+:\s*/, ''));
      if (mensajes.length) return mensajes.join('. ');
    }
    if (typeof cuerpo.detail === 'string') return cuerpo.detail;
    if (typeof cuerpo.message === 'string' && err.status < 500) return cuerpo.message;
  }
  if (err.status === 400) return 'Revisa los datos del formulario e inténtalo de nuevo.';
  if (err.status === 404) return 'No encontramos lo que buscabas en el servidor.';
  return 'Algo salió mal en el servidor. Inténtalo de nuevo más tarde.';
}
