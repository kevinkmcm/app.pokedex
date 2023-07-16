import { HttpClient } from "@angular/common/http";
import { PokemonList } from "../models/pokemon.list";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { PokemonDetail } from "../models/pokemon.details";

@Injectable({providedIn: 'root'})


export class PokemonService {
    private baseUrl = 'https://pokeapi.co/api/v2/';

    constructor(private http: HttpClient) {}


    getPokemonList(offset: number, limit: number = 30) : Observable<PokemonList[]>{
        return this.http.get<PokemonList>(this.baseUrl + 'pokemon?offset=' + offset + '&limit=' + limit)
        .pipe(
            map((x: any)=> x.results)
        );
    }


    getPokemonDetails(pokemon: number  | string ): Observable<PokemonDetail>{
        return this.http.get<PokemonDetail>(this.baseUrl + 'pokemon/'+ pokemon);
    }

}