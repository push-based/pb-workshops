import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponentModule } from '@movies/shared/ui';
import { MovieListPageComponent } from './movie-list-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MovieListModule } from '@movies/movies/ui-movie-list';

const ROUTES: Routes = [
  {
    path: 'list/:type/:identifier',
    component: MovieListPageComponent,
  },
];

@NgModule({
  declarations: [MovieListPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    MovieListModule,
    LoaderComponentModule,
  ],
  exports: [MovieListPageComponent],
})
export class MovieListPageModule {}
