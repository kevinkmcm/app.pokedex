import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokemonDetail } from '../../models/pokemon.details';
import { PokemonService } from '../../services/pokemon.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PokemonList } from '../../models/pokemon.list';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-card-pokemon',
  templateUrl: './card-pokemon.component.html',
  styleUrls: ['./card-pokemon.component.scss']
})
export class CardPokemonComponent implements OnInit {

  search: FormControl = new FormControl('');
  pokemons: PokemonDetail[] = [];
  classicMode: boolean = true;
  pokemosType: PokemonDetail[] = [];
  types: any[] = [];


  @ViewChild('popupContainer', { static: false }) popupContainer!: ElementRef;

  private offset: number = 0;
  private isByType : boolean = false;
  isLoading: boolean = false;
  isLastPage: boolean = false;
  

  searchPokemon: PokemonDetail = new PokemonDetail();
  isSearching = false;
  selectedPokemon: PokemonDetail | undefined;

  constructor(
    private pokemonService: PokemonService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  // si viene en la url el type no hacer el getPage sino usar el getAmountPokemonByType
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const nameParam = params[ 'name' ];  
      if ( nameParam) {
        this.getAmountPokemonByType(nameParam );
        this.isByType = true;
      } else {
        this.getPage(this.offset);
        this.isByType = false;
      }
    });
  } 
  
  

  redirectToAbout() {
    this.router.navigate(['/charts']);
  }


  getPage(offset: number): void {
    if (!this.isLoading && !this.isLastPage) {
      this.isLoading = true;
      this.pokemonService.getPokemonList(offset).subscribe(
        (list: PokemonList[]) => {
          if (list.length === 0) {
            this.isLastPage = true;
          }
          if (!this.isLastPage) {
            this.getPokemon(list);
          }
          this.isLoading = false; // Agregamos esta línea para indicar que la carga ha finalizado
        },
        (error: any) => {
          this.isLoading = false; // Agregamos esta línea para indicar que la carga ha finalizado
          // Manejo de errores, si es necesario
        }
      );
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
      if (this.isByType) {
        return;
      } else {
        (this.getPage(this.offset));
      }
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
 
  getAmountPokemonByType(nameParam: any): void {       
    if (nameParam) {
      const url = `https://pokeapi.co/api/v2/type/${nameParam}`;
      this.http.get<any>(url).subscribe(response => {        
        const pokemonList = response.pokemon.map((pokemon: any) => pokemon.pokemon);
        const requests: Observable<any>[] = pokemonList.map((pokemon: any) =>
          this.http.get<any>(pokemon.url)
        );
  
        forkJoin(requests).subscribe(pokemonResponses => {
          this.pokemons = pokemonResponses.map((response: any) => {
            const pokemon: PokemonDetail = new PokemonDetail();
            pokemon.name = response.name;
            pokemon.height = response.height;
            pokemon.weight = response.weight;
            pokemon.abilities = response.abilities;
            pokemon.stats = response.stats;
            pokemon.types = response.types;
            pokemon.sprites = response.sprites;
            return pokemon;
          });
        });
      });
    }
  } 
  
}



