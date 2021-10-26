import { Injectable } from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import {
  distinctUntilChanged, endWith,
  map,
  merge, mergeMap,
  Observable,
  OperatorFunction, startWith,
  Subject,
  switchMap
} from 'rxjs';
import { MovieGenreModel } from '../../shared/model/movie-genre.model';
import { MovieModel } from '../../shared/model/movie.model';
import { createDeepMergeAccumulator } from '../../shared/utils/deep-merge-accumulator';
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
  updating: Record<string, boolean>;
}


@Injectable({ providedIn: 'root' })
export class MovieStateService extends RxState<MovieState> {

  /** selectors **/

  genres$ = this.select('genres');
  movieList$ = this.select(
    selectSlice(['movies', 'error', 'loading', 'updating'])
  );

  private loadMovieCategory$ = new Subject<string>();
  private loadMovieGenre$ = new Subject<MovieGenrePayload>();

  private updateMovieRating$ = new Subject<{ movie: MovieModel; rating: number}>();

  constructor(
    private movieData: MovieDataService
  ) {
    super();
    this.setAccumulator(createDeepMergeAccumulator(['updating']));
    this.set({
      genres: [],
      loading: false,
      movies: [],
      error: null,
      updating: {}
    });
    this.connect('genres', movieData.getGenres());
    this.connect(
      this.updateMovieRating$.pipe(
        mergeMap(({ movie, rating }) => {
          return this.movieData.updateMovieRating(movie.id, rating).pipe(
            startWith({ updating: { [movie.id]: true  }}),
            endWith({ updating: { [movie.id]: false  }})
          );
        })
      )
    );
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

  updateMovieRating(
    payload: { movie: MovieModel, rating: number }
  ) {
    this.updateMovieRating$.next(payload);
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
