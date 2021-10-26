import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import {
  distinctUntilChanged,
  map,
  merge,
  Observable,
  OperatorFunction,
  Subject,
  switchMap
} from 'rxjs';
import { MovieGenreModel } from '../../shared/model/movie-genre.model';
import { MovieModel } from '../../shared/model/movie.model';
import { exhaustFetch } from '../../shared/utils/exhaust-fetch';
import { MovieDataService } from '../api/movie-data.service';

interface MovieGenrePayload {
  genreId: string;
  page: string;
  sortBy: string;
}

type MovieFetchPayload = string | MovieGenrePayload;

function compareFetchMoviePayload(oldVal: MovieFetchPayload, newVal: MovieFetchPayload): boolean {
  if (oldVal == null && newVal != null) {
    return true;
  }
  if (oldVal != null && newVal == null) {
    return true;
  }
  if (typeof oldVal !== typeof newVal) {
    return false;
  }
  if (typeof oldVal === 'string') {
    return oldVal === newVal;
  }
  return (newVal as any).genreId === oldVal.genreId &&
    (newVal as any).page === oldVal.page &&
    (newVal as any).sortBy === oldVal.sortBy;
}

export interface MovieState {
  genres: MovieGenreModel[];
  movies: MovieModel[];
  loading: boolean;
  error: any;
}


@Injectable({ providedIn: 'root' })
export class MovieStateService extends RxState<MovieState> {

  /** selectors **/

  genres$ = this.select('genres');
  movieList$ = this.select(
    selectSlice(['movies', 'error', 'loading'])
  );

  private loadMovieCategory$ = new Subject<string>();
  private loadMovieGenre$ = new Subject<MovieGenrePayload>();

  constructor(
    private movieData: MovieDataService
  ) {
    super();
    this.set({
      genres: [],
      loading: false,
      movies: [],
      error: null
    });
    this.connect('genres', movieData.getGenres());
    // connect movies, loading, error
    this.connect(
      this.fetchMoviesAction$()
        .pipe(
          distinctUntilChanged(compareFetchMoviePayload),
          switchMap(payload => this.fetchMovies$(payload))
        )
    );
  }

  /** actions **/

  loadMovieCategory(
    category: string
  ) {
    this.loadMovieCategory$.next(category);
  }

  loadMovieGenre(
    genreId: string,
    page: string = '1',
    sortBy: string = 'popularity.desc'
  ) {
    this.loadMovieGenre$.next({ genreId, page, sortBy });
  }

  private fetchMoviesAction$ = (): Observable<MovieFetchPayload> => merge(
    this.loadMovieCategory$,
    this.loadMovieGenre$
  );

  /** effect **/

  private fetchMovies$(payload: MovieFetchPayload): Observable<
    Partial<{ movies: MovieModel[], loading: boolean, error: any }>
  > {
    const data$ = typeof payload === 'string' ?
                  this.movieData.getMovieCategory(payload) :
                  this.movieData.getMovieGenre(payload.genreId, payload.page, payload.sortBy);
    return exhaustFetch(
      this.fetchMoviesAction$(),
      data$.pipe(
        map(response => ({ movies: response.results }))
      )
    );
  }
}
