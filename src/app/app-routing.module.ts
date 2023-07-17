import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardPokemonComponent } from './components/list-pokemon/card-pokemon.component';
import { ChartsComponent } from './components/charts/charts.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'charts',
    component: ChartsComponent,
    
  },
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
