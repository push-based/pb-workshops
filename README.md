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

**movie-list.component**

* add `app-dirty-check` to template
* run
* turn on CD
* data still shown, checked() count is 1

**movie-list-page.component**

* add `app-dirty-check` to template
* run
* turn on CD
* movies missing, how to fix?
  * `cdRef#markForCheck`
  * `movies$` => async pipe
  
**app-shell.component**

* add `app-dirty-check` to template
* run
* turn on CD
* genres missing, how to fix?
  * `cdRef#markForCheck`
  * `genres$` => async pipe

* **app.component**

* add `app-dirty-check` to template
* run
* turn on CD
* run again

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
* run
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

