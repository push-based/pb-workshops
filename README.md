# PbWorkshops Exercises

## ChangeDetection

### Dirty Check

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

### CD OnPush

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

### trackBy

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

## State Management

### Local State

**app-shell.component**

* activeRoute$ | async pipe usage (ngFor)
  * shareReplay()
  * *ngIf= (o$ | async) as
* subscribe => genre = result

**move-list-page.component**

subscription handling:
 * unsubscribe 

manage list state:
  * loading, error, refresh 
    * start: https://stackblitz.com/edit/angular-ivy-xlcrcn
    * end: https://stackblitz.com/edit/angular-ivy-r84fjs
  * favorite (update per item)
 
pagination & filter:
  
### Global State

**movie-state**

introduce `MovieDataState` 
* movies:
  * loading
  * error
  * re-fetch
  * search
  * filter
  * pagination
* genres:
  * share

**auth**

* introduce auth state
* implement login/logout flow, reflect in the UI
* implement auth interceptor

**dependency injection**
* introduce abstraction layer (port-pattern)

## Component Patterns

### Content Projection

**movie-list.component.ts**

* add header outlet `ng-content select=".header"`
* user header in movie-list-page.component:

```html
<app-movie-list>
  <div class="header">
    <h1 class="title">{{ title || '' }}</h1>
    <p class="subtitle">movies</p>
  </div>
</app-movie-list>
```

**star-rating.component.ts**

* make custom star template

### structural directives
* implement `isAuthed` Directive => structural directive

### svg templates
* create nav-item-icon.component from svg in app-shell.component

### lazy components
* https://stackblitz.com/edit/angular-ivy-aa8cxj
* https://stackblitz.com/edit/angular-ivy-mz8hsi

### flattening operators
https://stackblitz.com/edit/rxjs-flattening-operators-example

## NX

### init workspace & task-graph

* migrate to nx: npx nx init-workspace
* extract shared libraries
* use affected commands
* watch dependency graph

### organize code with libs

* migrate libs
* setup module boundaries
* affected
* fix boundary errors

### generators (schematics)

* implement custom schematic
* run custom schematic
