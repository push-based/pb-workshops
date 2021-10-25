import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListPageComponent } from './movie-list-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MovieListModule } from '../../ui/components/movie-list/movie-list.module';

const ROUTES: Routes = [
  {
    path: 'list/:type/:identifier',
    component: MovieListPageComponent,
  }
];

@NgModule({
  declarations: [MovieListPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MovieListModule,
  ],
  exports: [MovieListPageComponent],
})
export class MovieListPageModule { }
