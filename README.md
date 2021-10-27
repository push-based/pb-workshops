# ChangeDetection

## Dirty Check

**dirty-check.component.ts** (optional)

* implement dirty-check.component.ts
* `src/app/ui/atoms/dirty-check.component.ts`

```ts
@Component({
  selector: 'app-dirty-check',
  template: `{{ check() }}`
})
export class DirtyCheckComponent {
    private _checked = 0;
    check() {
        return this._checked++;
    }
}
// obsolete in v13 (experimental)
@NgModule({
  imports: [],
  exports: [DirtyCheckComponent],
  declarations: [DirtyCheckComponent],
})
export class DirtyCheckComponentModule {}
```

## CD OnPush

### movie-list.component

add `app-dirty-check` to template

```html
<!-- movie-list.component.html -->
<app-dirty-check></app-dirty-check>
```

run

```shell
yarn run start
```

turn on CD

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```
data still shown, checked() count is 1

### movie-list-page.component

add `app-dirty-check` to template

```html
<!-- movie-list-page.component.html -->
<app-dirty-check></app-dirty-check>
```

run

```shell
yarn run start
```

turn on CD

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

movies missing, how to fix?

`cdRef#markForCheck`

```ts
// movie-list-page.component.ts

this.routerParams$.pipe(/* service calls */).subscribe(() => {
    // 
    this.cdRef.markForCheck();
})
```

`movies$` => async pipe

```ts
// movie-list-page.component.ts

movies$ = this.routerParams$.pipe(/* service calls */)
```

```html
<app-movie-list [movies]="movies$ | async"></app-movie-list>

```
  
### app-shell.component

add `app-dirty-check` to template

```html
<!-- app-shell.component.html -->
<app-dirty-check></app-dirty-check>
```

run

```shell
yarn run start
```

turn on CD

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```


genres missing, how to fix?

`cdRef#markForCheck`

```ts
// app-shell.component.ts

this.movieService.getGenres().subscribe(() => {
    // 
    this.cdRef.markForCheck();
})
```

`genres$` => async pipe

```ts
// app-shell.component.ts

genres$ =  this.movieService.getGenres()
```

```html
<div *ngFor="let genre of genres$ | async"></div>

```

### app.component

* add `app-dirty-check` to template
* run
* turn on CD
* run again

## trackBy (Part 2)

**(optional) trackByProp util**

* implement `trackByProp` util function
* `src/app/shared/utils/track-by.ts`

```ts
export const trackByProp: <T>(prop: keyof T) => TrackByFunction<T> =
  <T>(prop: keyof T) =>
    (_: number, item: T) =>
      item[prop];
```

**movie-list.component.ts**

* add `app-dirty-check` to movie-item template
* add trackBy to `*ngFor="let movie of movies;"`
* run again

```ts
// use util function
trackMovie = trackByProp<Movie>('id');
// or implement it plain
movieById(_: number, movie: Movie) {
  return movie.id;
}
```

**app-shell.component.ts**

* add `app-dirty-check` to genre-item template
* run
* add trackBy to `*ngFor="let genre of genres;"`
* run again

```ts
// use util function
trackGenre = trackByProp<MovieGenreModel>('name');
// or implement it plain
trackGenre(index: number, genre: MovieGenreModel) {
  return genre.name;
}
```

