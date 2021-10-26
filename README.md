# State Management

## Global State

### 02 extend global state

The goal is to remove the dependency to `MovieDataService` from
our components.

Let's move the missing `updating: Record<string, boolean>` 
to the global state service.

go to `src/app/data-access/state/movie-state.service.ts`

```ts
// movie-state.service.ts

// extend the state interface
export interface MovieState {
  genres: MovieGenreModel[];
  movies: MovieModel[];
  loading: boolean;
  error: any;
  // add updating property
  updating: Record<string, boolean>;
}
```

implement the actions/triggers:

```ts
private updateMovieRating$ = new Subject<{ movie: MovieModel; rating: number}>();

updateMovieRating(
  payload: { movie: MovieModel, rating: number }
) {
  this.updateMovieRating$.next(payload);
}
```

connect the action to the state:

```ts

constructor() {
  // don't forget to set the accumulator from movie-list-page.component
  this.setAccumulator(createDeepMergeAccumulator(['updating']));
  this.set({
    // ...code
    // set default state for updating property
    updating: {}
  });
  //... code
  // move the code-snippet from movie-list-page.component.ts to the global state
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
```

Expose the updating map as part of the `movieList$`:

```ts
// movie-state.service.ts

movieList$ = this.select(
  selectSlice(['movies', 'error', 'loading', 'updating'])
);

```

Finally, remove all occurrences of `MovieDataService` in `movie-list-page.component.ts`
and call `updateMovieRating` of `MovieStateService`.

```ts
// movie-list-page.component.ts

movieRatingUpdated(update: { movie: MovieModel, rating: number }) {
  this.movieState.updateMovieRating(update);
}
```
