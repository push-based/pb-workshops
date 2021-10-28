import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponentModule } from '../../ui/atoms/loader/loader.component';
import { MovieListPageComponent } from './movie-list-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MovieListModule } from '../../ui/components/movie-list/movie-list.module';

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
