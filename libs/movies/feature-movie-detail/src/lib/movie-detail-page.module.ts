import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoaderComponentModule } from '@movies/shared/ui';
import { MovieDetailPageComponent } from './movie-detail-page.component';
import { StarRatingModule } from '@movies/shared/ui';
import { AspectRatioBoxModule } from '@movies/shared/ui';
import { MovieListModule } from '@movies/movies/ui-movie-list';

const ROUTES: Routes = [
  {
    path: 'movie/:id',
    component: MovieDetailPageComponent,
  },
];

@NgModule({
  declarations: [MovieDetailPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    StarRatingModule,
    MovieListModule,
    LoaderComponentModule,
    AspectRatioBoxModule,
  ],
  exports: [MovieDetailPageComponent],
})
export class MovieDetailPageModule {}
