import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieGenreModel } from '@movies/shared/models';
import { MovieModel } from '@movies/shared/models';

@Injectable()
export abstract class AbstractMovieState {
  abstract genres$: Observable<MovieGenreModel[]>;
  abstract movieList$: Observable<{
    movies: MovieModel[];
    error: any;
    loading: boolean;
    updating: Record<string, boolean>;
  }>;

  abstract loadMovieCategory(category: string): void;

  abstract loadMovieGenre(
    genreId: string,
    page?: string,
    sortBy?: string
  ): void;

  abstract updateMovieRating(payload: {
    movie: MovieModel;
    rating: number;
  }): void;
}
