import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  combineLatest,
  endWith,
  map, mergeMap,
  Observable,
  startWith,
  Subject,
} from 'rxjs';
import { MovieDataService } from '../../data-access/api/movie-data.service';
import { MovieStateService } from '../../data-access/state/movie-state.service';
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

  constructor(
    private route: ActivatedRoute,
    private movieData: MovieDataService,
    private movieState: MovieStateService
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
    this.loadSideEffect();
    this.errorSideEffect();
    this.connectMovieState();
    this.loadMovies();
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
  }

  movieRatingUpdated(update: { movie: MovieModel, rating: number }) {
    this.updateMovieRating$.next(update);
  }

  loadMovies() {
    this.loadMovies$.next();
  }

  private connectMovieState() {
    this.connect(this.movieState.movieList$);
  }

  private loadSideEffect() {
    this.hold(
      combineLatest([
        this.routerParams$,
        this.loadMovies$
      ]).pipe(map(([routerParams]) => routerParams)),
      ({ identifier, type }) => {
        if (type === 'category') {
          this.movieState.loadMovieCategory(identifier);
        } else {
          this.movieState.loadMovieGenre(identifier);
        }
      }
    );
  }

  private errorSideEffect() {
    this.hold(
      this.select('error'),
      error => {
        if (error) {
          alert(error.message);
        }
      }
    );
  }
}
