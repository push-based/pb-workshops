import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  combineLatest,
  map,
  Observable,
  Subject,
} from 'rxjs';
import { MovieStateService } from '../../data-access/state/movie-state.service';
import { MovieModel } from '../../shared/model/index';


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


  constructor(
    private route: ActivatedRoute,
    private movieState: MovieStateService
  ) {
    super();
    this.set({
      loading: true,
      error: null,
      movies: [],
      updating: {}
    });
  }

  ngOnInit() {
    this.loadSideEffect();
    this.errorSideEffect();
    this.connectMovieState();
    this.loadMovies();
  }

  movieRatingUpdated(update: { movie: MovieModel, rating: number }) {
    this.movieState.updateMovieRating(update);
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
