import { Component, Inject, OnInit } from '@angular/core';
import { PokemonDetail } from '../../models/pokemon.details';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  pokemon: PokemonDetail;
  classicMode: boolean = true;


  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) { 
    this.pokemon = data.pokemon;
    this.classicMode = data.classicMode;
  }


  ngOnInit(): void {
  }

  getAbilities(): string {
    return this.pokemon.abilities.map(x => x.ability.name).join(', ');
  }


  getPrincipalType(list: any[]) {
    return list.filter(x => x.slot === 1)[0]?.type.name;
  }

}
