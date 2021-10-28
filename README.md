# Dependency Injection

## Abstract Movie State

We want to setup our global state resilient against changes and provide consumers with
just an interface of our state.

Let's first implement the abstract service.

create a file: `src/app/data-access/state/abstract-movie-state.service.ts`

```ts
// abstract-movie-state.service.ts

import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieStateService } from './movie-state.service';

@Injectable()
export abstract class AbstractMovieState {
    
}
```

Now add the needed functions

```ts
// abstract-movie-state.service.ts

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

```

Let the `MovieStateService` implement our abstract interface.

```ts
// movie-state.service.ts

export class MovieStateService
  extends RxState<MovieState> implements AbstractMovieState {
  
}
```

After the service implementation is finished, we want to provide
the `MovieStateService` as our `AbstractMovieState` interface to the consumers.

go to `src/app/app.module.ts`

```ts
// app.module.ts

@NgModule({
  declarations: [AppComponent],
  imports: [
      //
  ],
  providers: [
    // ...,
    {
      provide: AbstractMovieState,
      useExisting: MovieStateService
    }
  ],
  bootstrap: [AppComponent]
})

```

Finally, we need to adapt the usage from `MovieStateService` to `AbstractMovieState`
in our components.

```ts
// app-shell.component.ts

constructor(
  private router: Router,
  private movieState: AbstractMovieState
) {
  super();
}

```

Do that for all missing components.

Nice job, we have migrated to a resilient interface based clean architecture!

