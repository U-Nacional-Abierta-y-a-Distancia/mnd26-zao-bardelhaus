import { Component } from '@angular/core';

interface Integrante {
  nombre: string;
  foto: string;
}

const EQUIPO: Integrante[] = [
  { nombre: 'Ichel', foto: 'img/equipo/ichel.jpg' },
  { nombre: 'Natalia', foto: 'img/equipo/natalia.jpg' },
  { nombre: 'Carolina', foto: 'img/equipo/carolina.jpg' },
];

@Component({
  selector: 'app-pie',
  templateUrl: './pie.html',
  styleUrl: './pie.css',
})
export class Pie {
  protected readonly equipo = EQUIPO;
  protected readonly anio = new Date().getFullYear();
}
