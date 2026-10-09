import { compararEnElTiempo, DatoMorichalRespuesta, intervaloPara, leerFecha, ultimaLectura } from './dato-morichal';

describe('leerFecha', () => {
  it('lee LocalDateTime con microsegundos y en forma de arreglo', () => {
    const f = leerFecha('2026-10-07T11:36:21.058768');
    expect([f.getHours(), f.getMinutes(), f.getSeconds(), f.getMilliseconds()]).toEqual([11, 36, 21, 58]);
    expect(leerFecha([2026, 10, 7, 14, 10, 0]).getHours()).toBe(14);
  });
});

describe('intervaloPara', () => {
  it('agrupa más fino cuando los datos cubren poco tiempo', () => {
    expect(intervaloPara(10 * 60_000)).toBe(60_000);
    expect(intervaloPara(24 * 3_600_000)).toBe(3_600_000);
  });
});

describe('compararEnElTiempo', () => {
  const datos: DatoMorichalRespuesta[] = [
    { tipoMedicion: 'TEMPERATURA', tipoSensor: 'INTERNO', valor: 25, fechaCreacion: '2026-10-07T14:05:00' },
    { tipoMedicion: 'TEMPERATURA', tipoSensor: 'INTERNO', valor: '26', fechaCreacion: '2026-10-07T14:40:00' },
    { tipoMedicion: 'TEMPERATURA', tipoSensor: 'EXTERNO', valor: 31.5, fechaCreacion: [2026, 10, 7, 14, 10, 0] },
    { tipoMedicion: 'TEMPERATURA', tipoSensor: 'EXTERNO', valor: 30, fechaCreacion: '2026-10-07T12:00:00' },
    { tipoMedicion: 'HUMEDAD', tipoSensor: 'INTERNO', valor: 80, fechaCreacion: '2026-10-07T14:00:00' },
  ];

  it('agrupa en intervalos, promedia cada sensor y conserva intervalos con un solo sensor', () => {
    const r = compararEnElTiempo(datos, 'TEMPERATURA');
    expect(r.map((p) => [p.fecha.getHours(), p.fecha.getMinutes(), p.dentro, p.fuera])).toEqual([
      [12, 0, null, 30],
      [14, 5, 25, null],
      [14, 10, null, 31.5],
      [14, 40, 26, null],
    ]);
  });

  it('funciona solo con el sensor interno (como llega hoy del backend)', () => {
    const r = compararEnElTiempo(datos, 'HUMEDAD');
    expect(r).toEqual([{ fecha: expect.any(Date), dentro: 80, fuera: null }]);
  });
});

describe('ultimaLectura', () => {
  const datos: DatoMorichalRespuesta[] = [
    { tipoMedicion: 'TEMPERATURA', tipoSensor: 'INTERNO', valor: 27.5, fechaCreacion: '2026-10-07T11:36:21.058768' },
    { tipoMedicion: 'TEMPERATURA', tipoSensor: 'INTERNO', valor: 27.1, fechaCreacion: '2026-10-07T11:36:09.044945' },
  ];

  it('devuelve la lectura más reciente del sensor, o null si no midió', () => {
    expect(ultimaLectura(datos, 'TEMPERATURA', 'INTERNO')?.valor).toBe(27.5);
    expect(ultimaLectura(datos, 'TEMPERATURA', 'EXTERNO')).toBeNull();
  });
});
