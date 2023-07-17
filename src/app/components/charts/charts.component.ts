import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  view: [number, number] = [700, 400];
  // bar  options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Pokemon Types';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  
  // pie options 
   showLabels: boolean = true;
   isDoughnut: boolean = false;
   legendPosition: LegendPosition =   LegendPosition.Right
  
  
  pokemonTypes: any[] = [];

  constructor(private http: HttpClient,
    private router: Router,
    ) {}

  results: { name: string, value: string}[] = []

  async ngOnInit() {
    const pokemonTypes = await this.getQuantityByType();
    console.log(pokemonTypes);

    this.results = pokemonTypes.map((x) => {
      return {
       name: x.name,
       value: x.quantity
      }
    });
  }

  redirectToAbout() {
    this.router.navigate(['']);
  }

  onSelect(event: any) {
    console.log(event);
  }

  async getQuantityByType() {
    try {
      const url = 'https://pokeapi.co/api/v2/type';
      const response = await firstValueFrom(this.http.get<any>(url));
      this.pokemonTypes = response.results;

      // Obtener cantidad de Pokémon para cada tipo
      for (const type of this.pokemonTypes) {
        const tipoResponse = await firstValueFrom(this.http.get<any>(type.url));
        type.quantity = tipoResponse.pokemon.length;
      }

      return this.pokemonTypes;
    } catch (error) {
      console.error('Error en la solicitud: ', error);
      throw error;
    }
  }
}
