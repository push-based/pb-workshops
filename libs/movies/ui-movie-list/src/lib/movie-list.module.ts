import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponentModule, StarRatingModule, AspectRatioBoxModule } from '@movies/shared/ui';
import { MovieListComponent } from './movie-list.component';

@NgModule({
  declarations: [MovieListComponent],
  imports: [
    CommonModule,
    RouterModule,
    StarRatingModule,
    AspectRatioBoxModule,
    LoaderComponentModule,
  ],
  exports: [MovieListComponent],
})
export class MovieListModule {}
