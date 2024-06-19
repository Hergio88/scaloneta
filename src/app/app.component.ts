import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Jugador {
  nombre: string;
  apellido: string;
  edad: number;
  posicion: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  jugadores: Jugador[] = [];
  posicionSeleccionada: Jugador[] = [];
  edadPromedio: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getJugadores();
  }

  getJugadores(): void {
    this.http.get<Jugador[]>('assets/jugadores.data.json').subscribe(
      jugadores => {
        this.jugadores = jugadores;
        this.calcularEdadPromedio();
      },
      error => {
        console.error('Error al obtener los jugadores:', error);
      }
    );
  }

  filtrarPorPosicion(posicion: string): void {
    this.posicionSeleccionada = this.jugadores.filter(jugador => jugador.posicion === posicion);
    this.calcularEdadPromedio();
  }

  mostrarTodo(): void {
    this.posicionSeleccionada = [...this.jugadores];
    this.calcularEdadPromedio();
  }

  eliminaAbuelo(): void {
    if (!this.posicionSeleccionada || this.posicionSeleccionada.length === 0) {
      console.warn('No hay jugadores para eliminar.');
      return;
    }

    let edadMaxima = -Infinity;
    let indiceJugadorMasViejo = -1;

    for (let i = 0; i < this.posicionSeleccionada.length; i++) {
      const jugador = this.posicionSeleccionada[i];
      if (jugador.edad > edadMaxima) {
        edadMaxima = jugador.edad;
        indiceJugadorMasViejo = i;
      }
    }

    if (indiceJugadorMasViejo !== -1) {
      this.posicionSeleccionada.splice(indiceJugadorMasViejo, 1);
      this.calcularEdadPromedio();
    }
  }

  calcularEdadPromedio(): void {
    if (this.posicionSeleccionada.length === 0) {
      this.edadPromedio = 0;
      return;
    }
    const totalEdades = this.posicionSeleccionada.reduce((acc, jugador) => acc + jugador.edad, 0);
    this.edadPromedio = totalEdades / this.posicionSeleccionada.length;
  }

}
