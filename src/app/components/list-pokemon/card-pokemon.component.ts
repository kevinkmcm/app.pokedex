import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokemonDetail } from '../../models/pokemon.details';
import { PokemonService } from '../../services/pokemon.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PokemonList } from '../../models/pokemon.list';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-card-pokemon',
  templateUrl: './card-pokemon.component.html',
  styleUrls: ['./card-pokemon.component.scss']
})
export class CardPokemonComponent implements OnInit {
  search: FormControl = new FormControl('');
  pokemons: PokemonDetail[] = [];
  classicMode: boolean = true;

  types: any[] = []

  

  @ViewChild('popupContainer', { static: false }) popupContainer!: ElementRef;

  private offset: number = 0;
  isLoading: boolean = false;
  isLastPage = false;

  searchPokemon: PokemonDetail = new PokemonDetail();
  isSearching = false;
  selectedPokemon: PokemonDetail | undefined;

  constructor(
    private pokemonService: PokemonService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getPage(this.offset);
    this.getAmountPokemonByType();
  }

  getPage(offset: number): void {
    if (!this.isLoading && !this.isLastPage) {
      this.isLoading = true;
      this.pokemonService.getPokemonList(offset).subscribe((list: PokemonList[]) => {
        if (list.length === 0) {
          this.isLastPage = true;
        }

        if (!this.isLastPage) {
          this.getPokemon(list);
        }
      });
    }
  }

  onSearchPokemon(): void {
    const value = this.search.value;
    if (value === '') {
      this.isSearching = false;
    } else {
      this.isSearching = true;
      this.isLoading = true;
      this.pokemonService.getPokemonDetails(value).subscribe(
        (pokemon: PokemonDetail) => {
          this.searchPokemon = pokemon;
          this.isLoading = false;
        },
        (error: any) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.snackBar.open('Pokemon no encontrado', 'OK', {
              duration: 5000
            });
          }
        }
      );
    }
  }

  onScroll(event: Event): void {
    const element: HTMLDivElement = event.target as HTMLDivElement;
    if (element.scrollHeight - element.scrollTop < 1000) {
      this.getPage(this.offset);
    }
  }

  private getPokemon(list: PokemonList[]): void {
    const arr: Observable<PokemonDetail>[] = [];
    list.map((value: PokemonList) => {
      arr.push(this.pokemonService.getPokemonDetails(value.name));
    });

    forkJoin([...arr]).subscribe((pokemons: PokemonDetail[]) => {
      this.pokemons.push(...pokemons);
      this.offset += 30;
      this.isLoading = false;
    });
  }

  getPrincipalType(list: any[]): string {
    return list.filter((x) => x.slot === 1)[0]?.type.name;
  }

  getAbilities(pokemon: PokemonDetail): string {
    return pokemon.abilities.map((ability) => ability.ability.name).join(', ');
  }

  showPopup(pokemon: PokemonDetail) {
    this.selectedPokemon = pokemon;
    const popupContainer = document.getElementById('popupContainer');
    if (popupContainer) {
      popupContainer.style.display = 'flex';
    }
  }

  hidePopup() {
    const popupContainer = document.getElementById('popupContainer');
    if (popupContainer) {
      popupContainer.style.display = 'none';
    }
  }


  getAmountPokemonByType(): void {
    const url = 'https://pokeapi.co/api/v2/type';
    this.http.get<any>(url).subscribe(response => {
      this. types = response.results;

      // Obtener cantidad de Pokémon para cada tipo
      for (const tipo of this. types) {
        this.http.get<any>(tipo.url).subscribe(tipoResponse => {
          tipo.cantidadPokemon = tipoResponse.pokemon.length;
        });
      }
    });
  }
}


