# Dependency Injection

## Abstract Movie State

We want to ship a new version of `MovieStateService` and introduce
it to the codebase with minimal changes as possible.

Let's first implement our new service.

create a file: `src/app/data-access/state/special-movie-state.service.ts`

```ts
// special-movie-state.service.ts

import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieStateService } from './movie-state.service';

@Injectable({ providedIn: 'root' })
export class SpecialMovieStateService extends MovieStateService {
    
}
```

Our new implementation returns `special` genres.

```ts
// special-movie-state.service.ts

genres$ = this.select('genres').pipe(
    map(genres => genres.map(g => ({
      ...g,
      name: `special ${g.name}`
    })))
  )

```


After the service implementation is finished, we want to provide
the new special instance of our `MovieStateService` to the consumers.

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
      provide: MovieStateService,
      useExisting: SpecialMovieStateService
    }
  ],
  bootstrap: [AppComponent]
})

```

Now run the application and see if the new genres appear in the view.

