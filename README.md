# State Management

## Local State

### 01 simple local state

go to `src/app/app-shell/app-shell.component.ts`

create local `state$` and `viewModel$` variables

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

"connect" variables to local state

```ts
// app-shell.component.ts

private activeRoute$ = this.router.events.pipe(
  filter((e): e is NavigationEnd => e instanceof NavigationEnd),
  map((e) => e.urlAfterRedirects.split('?')[0])
);

private genres$ = this.movieService.getGenres();

ngOnInit() {
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

use `viewModel$` in the view

```html
<!-- app-shell.component.html -->

<app-side-drawer
  [opened]="sideDrawerOpen"
  (openedChange)="closeSidenav()"
  *ngIf="viewModel$ | async as vm"
>
</app-side-drawer>
```

replace occurrences of `(activeRoute$ | async)` with `vm.activeRoute`

**Bonus**

introduce `sideDrawerOpen: boolean` to the state

**Bonus+**:

improve the `setState` api. Whenever we want to set a new value to our state, we need
to provide the current value + the old value in order to not lose it.
Let's simplify this process by introducing a generic `setState<K>` method.

```ts
setState<K extends keyof AppShellState>(prop: K, value: AppShellState[K]) {
  this.state$.next({
    ...this.state$.getValue(),
    [prop]: value
  })
}
```

we use it like:

```ts
this.genres$
  .subscribe(genres => {
    this.setState('genres', genres);
  });
this.activeRoute$.subscribe(activeRoute => {
  this.setState('activeRoute', activeRoute);
});
```

