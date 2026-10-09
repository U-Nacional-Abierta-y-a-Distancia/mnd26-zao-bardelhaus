export type TipoMedicion = 'TEMPERATURA' | 'HUMEDAD';

export type TipoSensor = 'INTERNO' | 'EXTERNO';

export interface DatoMorichalRespuesta {
  tipoMedicion: TipoMedicion;
  tipoSensor: TipoSensor;
  valor: number | string;
  fechaCreacion: string | number[];
}

export interface PuntoComparado {
  fecha: Date;
  dentro: number | null;
  fuera: number | null;
}

export interface Lectura {
  valor: number;
  fecha: Date;
}

const MIN = 60_000;

export function leerFecha(f: string | number[]): Date {
  if (Array.isArray(f)) {
    const [y, m, d, h = 0, mi = 0, s = 0] = f;
    return new Date(y, m - 1, d, h, mi, s);
  }
  return new Date(f.replace(/(\.\d{3})\d+/, '$1'));
}

function lecturas(datos: DatoMorichalRespuesta[], tipo: TipoMedicion) {
  return datos
    .filter((d) => d.tipoMedicion === tipo)
    .map((d) => ({ sensor: d.tipoSensor, valor: Number(d.valor), fecha: leerFecha(d.fechaCreacion) }))
    .filter((l) => !isNaN(l.valor) && !isNaN(l.fecha.getTime()));
}

export function intervaloPara(rangoMs: number): number {
  if (rangoMs <= 30 * MIN) return MIN;
  if (rangoMs <= 3 * 60 * MIN) return 5 * MIN;
  if (rangoMs <= 12 * 60 * MIN) return 15 * MIN;
  if (rangoMs <= 48 * 60 * MIN) return 60 * MIN;
  return 3 * 60 * MIN;
}

export function compararEnElTiempo(datos: DatoMorichalRespuesta[], tipo: TipoMedicion): PuntoComparado[] {
  const ls = lecturas(datos, tipo);
  if (!ls.length) return [];
  const tiempos = ls.map((l) => l.fecha.getTime());
  const paso = intervaloPara(Math.max(...tiempos) - Math.min(...tiempos));

  const grupos = new Map<number, { INTERNO: number[]; EXTERNO: number[] }>();
  for (const l of ls) {
    const clave = Math.floor(l.fecha.getTime() / paso) * paso;
    if (!grupos.has(clave)) grupos.set(clave, { INTERNO: [], EXTERNO: [] });
    grupos.get(clave)![l.sensor]?.push(l.valor);
  }
  const promedio = (v: number[]) =>
    v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
  return [...grupos.entries()]
    .sort(([a], [b]) => a - b)
    .map(([clave, g]) => ({ fecha: new Date(clave), dentro: promedio(g.INTERNO), fuera: promedio(g.EXTERNO) }));
}

export function ultimaLectura(datos: DatoMorichalRespuesta[], tipo: TipoMedicion, sensor: TipoSensor): Lectura | null {
  return lecturas(datos, tipo)
    .filter((l) => l.sensor === sensor)
    .reduce<Lectura | null>((u, l) => (!u || l.fecha > u.fecha ? { valor: l.valor, fecha: l.fecha } : u), null);
}
