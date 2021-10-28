import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieGenreModel } from '../../shared/model/movie-genre.model';
import { MovieModel } from '../../shared/model/movie.model';

@Injectable()
export abstract class AbstractMovieState {

  abstract genres$: Observable<MovieGenreModel[]>;
  abstract  movieList$: Observable<{
    movies: MovieModel[];
    error: any;
    loading: boolean;
    updating: Record<string, boolean>;
  }>;

  abstract loadMovieCategory(
    category: string
  ): void;

  abstract updateMovieRating(
    payload: { movie: MovieModel, rating: number }
  ): void;
}
