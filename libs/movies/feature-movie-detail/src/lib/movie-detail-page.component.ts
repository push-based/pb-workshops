import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { map } from 'rxjs';
import {
  MovieCastModel,
  MovieDetailsModel,
  MovieGenreModel,
  MovieModel,
} from '@movies/shared/models';
import { MovieDataService } from '@movies/shared/data-access';
import { ActivatedRoute, Router } from '@angular/router';
import { W780H1170 } from '@movies/shared/util';

type MovieDetail = MovieDetailsModel & { languages_runtime_release: string };

@Component({
  selector: 'app-movie',
  templateUrl: './movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailPageComponent {
  W342H513 = W780H1170;

  movie: MovieDetail | null = null;
  // this.movieData.getMovieRecommendations(id)
  recommendations: MovieModel[] | null = null;
  // this.movieData.getCredits(id)
  cast: MovieCastModel[] | null = null;

  private readonly id$ = this.route.params.pipe(map(({ id }) => id));

  constructor(
    private location: Location,
    private movieData: MovieDataService,
    private route: ActivatedRoute
  ) {}

  trackByGenre: TrackByFunction<MovieGenreModel> = (_, genre) => genre.name;
  trackByCast: TrackByFunction<MovieCastModel> = (_, cast) => cast.cast_id;
}
