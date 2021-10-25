# State Management

## Local State

### 01 simple local state

* go to `src/app/app-shell/app-shell.component.ts`
* create local `state$` and `viewModel$` variables

```ts
// app-shell.component.ts

private state$ = new BehaviorSubject<{
  activeRoute: string;
  genres: MovieGenreModel[]
}>({
  activeRoute: '',
  genres: []
});

viewModel$ = this.state$;
```

* "connect" variables to local state

```ts
// app-shell.component.ts

private activeRoute$ = this.router.events.pipe(
  filter((e): e is NavigationEnd => e instanceof NavigationEnd),
  map((e) => e.urlAfterRedirects.split('?')[0])
);

private genres$ = this.movieService.getGenres();

constructor() {
  this.genres$
    .subscribe(genres => {
      this.state$.next({
        genres,
        activeRoute: this.state$.getValue().activeRoute
      })
    });
  this.activeRoute$.subscribe(activeRoute => {
    this.state$.next({
      genres: this.state$.getValue().genres,
      activeRoute: activeRoute
    })
  });
}
```

* use `viewModel$` in the view

```html
<!-- app-shell.component.html -->

<app-side-drawer
  [opened]="sideDrawerOpen"
  (openedChange)="closeSidenav()"
  *ngIf="viewModel$ | async as vm"
>
</app-side-drawer>
```

* replace occurrences of `(activeRoute$ | async)` with `vm.activeRoute`

**Optional**

introduce `sideDrawerOpen: boolean` to the state


