# ChangeDetection

## trackBy

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

```html
<!-- movie-list.component.html -->

 <a
    class='movies-list--grid-item'
    *ngFor='let movie of _movies'
    (click)='toMovie(movie)'
  >
    <app-dirty-check></app-dirty-check>
    <!-- movie-list-item content -->
</a>
```

* run
* add trackBy to `*ngFor="let movie of movies;"`
* run again

```ts
// movie-list.component.html

// use util function
trackMovie = trackByProp<Movie>('id');
// or implement it plain
movieById(_: number, movie: Movie) {
  return movie.id;
}
```

**app-shell.component.ts**

* add `app-dirty-check` to genre-item template

```html
<!-- app-shell.component.html -->

<a
  *ngFor="
          let genre of genres$ | async;
        "
  class="navigation--link"
  [class.active]="(activeRoute$ | async) === '/list/genre/' + genre.id"
  (click)="navTo('/list', ['genre', genre.id])"
>
  <app-dirty-check></app-dirty-check>
  <!-- genre-item content -->
</a>
```

* run
* add trackBy to `*ngFor="let genre of genres$ | async;"`
* run again

```ts
// use util function
trackGenre = trackByProp<MovieGenreModel>('name');
// or implement it plain
trackGenre(index: number, genre: MovieGenreModel) {
  return genre.name;
}
```
