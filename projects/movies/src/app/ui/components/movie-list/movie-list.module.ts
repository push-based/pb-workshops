import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponentModule } from '../../atoms/loader/loader.component';
import { MovieListComponent } from './movie-list.component';
import { StarRatingModule } from '../../atoms/star-rating/star-rating.module';
import { AspectRatioBoxModule } from '../../atoms/aspect-ratio-box/aspect-ratio-box.module';

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
