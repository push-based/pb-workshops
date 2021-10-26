import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  catchError,
  endWith,
  exhaustMap,
  map, mergeMap,
  Observable,
  of,
  startWith,
  Subject,
  switchMap
} from 'rxjs';
import { MovieDataService } from '../../data-access/api/movie-data.service';
import { MovieModel } from '../../shared/model/index';
import { createDeepMergeAccumulator } from '../../shared/utils/deep-merge-accumulator';


type RouterParams = {
  type: 'category' | 'genre';
  identifier: string;
};

interface MovieListState {
  movies: MovieModel[];
  loading: boolean;
  error: any;
  updating: Record<string, boolean>;
}
interface FetchState {
  loading: boolean;
  error: any;
}

function exhaustFetch<T extends FetchState>(
  trigger$: Observable<void>,
  data$: Observable<Partial<T>>
): Observable<Partial<T>> {
  return trigger$.pipe(
    startWith(null),
    exhaustMap(() => {
      return data$.pipe(
        catchError(e => of({ error: e} as Partial<T>)),
        startWith({ loading: true, error: null } as Partial<T>),
        endWith({ loading: false } as Partial<T>)
      );
    })
  )
}

@Component({
  selector: 'app-movies',
  templateUrl: './movie-list-page.component.html',
  styles: [
      `
      :host {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListPageComponent
  extends RxState<MovieListState> implements OnInit {
  title: string = '';

  viewModel$ = this.select();

  private routerParams$: Observable<RouterParams> = this.route.params as unknown as Observable<RouterParams>;

  private loadMovies$ = new Subject<void>();
  private updateMovieRating$ = new Subject<{ movie: MovieModel; rating: number}>();

  private movieListState$ = this.routerParams$.pipe(
    switchMap(({ identifier, type }) => {
      const data$ = type === 'category' ?
                  this.movieData.getMovieCategory(identifier) :
                  this.movieData.getMovieGenre(identifier);
      return exhaustFetch<MovieListState>(
        this.loadMovies$,
        data$.pipe(map(response => ({
          movies: response.results
        })))
      )
    })
  );

  constructor(
    private route: ActivatedRoute,
    private movieData: MovieDataService
  ) {
    super();
    this.setAccumulator(createDeepMergeAccumulator(['updating']));
    this.set({
      loading: true,
      updating: {},
      error: null,
      movies: []
    });
  }

  ngOnInit() {
    this.connect(this.movieListState$);
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
    this.hold(
      this.select('error'),
      error => {
        if (error) {
          alert(error.message);
        }
      }
    )
  }

  movieRatingUpdated(update: { movie: MovieModel, rating: number }) {
    this.updateMovieRating$.next(update);
  }

  loadMovies() {
    this.loadMovies$.next();
  }
}
