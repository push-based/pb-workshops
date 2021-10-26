# State Management

## Global State

### 01 setup global movie state

The goal is to provide access to movies and other related data,
such as genres as global accessible state instead of maintaining the
api access on a component level.

Let's create our first global state service.

create `movie-state.service.ts` in `src/app/data-access/state/`.

```ts
// movie-state.service.ts

import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { MovieGenreModel } from '../../shared/model/movie-genre.model';
import { MovieModel } from '../../shared/model/movie.model';
import { MovieDataService } from '../api/movie-data.service';

interface MovieState {
  genres: MovieGenreModel[];
}

@Injectable({ providedIn: 'root' })
export class MovieStateService extends RxState<MovieState> {
  
  constructor() {
      super();
      // let's provide an initial state
      this.set({ genres: [] });
  }
}

```

Let's use the movie-data service to fill load the genres into our state.

```ts
// movie-state.service.ts

import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { MovieGenreModel } from '../../shared/model/movie-genre.model';
import { MovieModel } from '../../shared/model/movie.model';
import { MovieDataService } from '../api/movie-data.service';

interface MovieState {
  genres: MovieGenreModel[];
}

@Injectable({ providedIn: 'root' })
export class MovieStateService extends RxState<MovieState> {
  
  // expose the genres$ for further usage
  genres$ = this.select('genres');

  constructor(
    // inject the MovieDataService
    private movieData: MovieDataService
  ) {
    super();
    // fetch the genres to the state, they are needed
    // instantly and probably won't change
    this.connect('genres', movieData.getGenres());
  }
}

```

We can now use it in `app-shell.component.ts` and replace the usage
of `MovieDataService` with `MovieStateService`.

```ts
// app-shell.component.ts

ngOnInit() {
  // code...
  // connect the global state to the local state
  this.connect('genres', this.movieState.genres$);
  // code ...
}
```


Let's move on and implement `movies`, `error` and `loading` for the global state.

implement triggers for fetching movies for

```ts
// movie-state.service.ts

interface MovieGenrePayload {
  genreId: string;
  page: string;
  sortBy: string;
}

private loadMovieCategory$ = new Subject<string>();
private loadMovieGenre$ = new Subject<MovieGenrePayload>();

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

```

Let's also implement a little helper to combine our triggers into 1 action

```ts
// movie-state.service.ts

type MovieFetchPayload = string | MovieGenrePayload;

private fetchMoviesAction$ = (): Observable<MovieFetchPayload> => merge(
    this.loadMovieCategory$,
    this.loadMovieGenre$
  );
```

We can now use our helper as initialization point for fetching new movies
from the `MovieDataService`. The process will be very similar as it was in
`MovieListPageComponent`.


```ts
// movie-state.service.ts

constructor() {
  this.connect(
    // use fetchMoviesAction
    this.fetchMoviesAction$()
      .pipe(
        switchMap(payload => {
          // if payload is a string, we want to fetch a category,
          // otherwise we fetch a genre
          const data$ = typeof payload === 'string' ?
                        this.movieData.getMovieCategory(payload) :
                        this.movieData.getMovieGenre(payload.genreId, payload.page, payload.sortBy);
          // use exhaustFetch from `src/app/shared/utils/exhaust-fetch`
          return exhaustFetch(
            this.fetchMoviesAction$(),
            data$.pipe(
              map(response => ({ movies: response.results }))
            )
          );
        })
      )
  );
}
```

**Optional: extract fetchMovies to a function **

```ts
// movie-state.service.ts

constructor() {
  // connect movies, loading, error
  this.connect(
    this.fetchMoviesAction$()
      .pipe(
        switchMap(payload => this.fetchMovies$(payload))
      )
  );
}

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
```

Now we want to expose our state data for usage in 3rd party components.

```ts
// movie-state.service.ts

movieList$ = this.select(
  // method to extract slices of the state
  selectSlice(['movies', 'error', 'loading'])
);

```

Now the basic state transition is implemented. We are ready to implement
it in the `movie-list-page.component`.

```ts
// movie-list-page.component.ts

constructor(
  //...
  // make sure to inject MovieStateService
  private movieState: MovieStateService
) {}

ngOnInit() {
  // ...
  // replace usages of movieData fetch API with global state
  this.connectMovieState();
  this.loadMovies();
}

private connectMovieState() {
  this.connect(this.movieState.movieList$);
}

```

Also we need to adapt the side-effect which triggers the global-state to
re-fetch the movies.

```ts
ngOnInit() {
  // ...
  this.loadSideEffect();
  // replace usages of movieData fetch API with global state
  this.connectMovieState();
  this.loadMovies();
}
// we introduce a new function which encapsulates 
// our loading side-effect
private loadSideEffect() {
  // register a side-effect
  this.hold(
    // whenever routerParams$ changes
    // or we manually trigger reload
    combineLatest([
      this.routerParams$,
      this.loadMovies$
    ])
      .pipe(
        // return the latest routerParams
        map(([routerParams]) => routerParams)
      ),
    ({ identifier, type }) => {
      if (type === 'category') {
        this.movieState.loadMovieCategory(identifier);
      } else {
        this.movieState.loadMovieGenre(identifier);
      }
    }
  );
}
```

for the sake of visual appearance, if you want, you can refactor 
the `error` side-effect to a function as well.

```ts
ngOnInit() {
  this.errorSideEffect();
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
```

## Bonus: comparator

If implemented as described, the re-fresh functionality will be broken.
It will cancel the old request and start a new one instead of waiting for
one refresh to finish.

Implement a fix for this, so that consequent re-freshes are not cancelling
anymore.

```ts
// movie-state.service.ts

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

// connect movies, loading, error
this.connect(
  this.fetchMoviesAction$()
    .pipe(
      // we suppress the
      distinctUntilChanged(compareFetchMoviePayload),
      switchMap(payload => this.fetchMovies$(payload))
    )
);
```
