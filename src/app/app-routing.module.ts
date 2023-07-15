import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardPokemonComponent } from './components/list-pokemon/card-pokemon.component';


const routes: Routes = [
  {
    path: 'home',
    component: CardPokemonComponent // Agrega el componente correspondiente
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
