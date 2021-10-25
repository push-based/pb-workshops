# State Management

## Local State

### 02 simple local state structured

* introduce `RxState` to the component

```ts
// app-shell.component.ts

export class AppShellComponent extends RxState<{
  activeRoute: string;
  genres: MovieGenreModel[];
  sideDrawerOpen: boolean
}> implements OnInit {
  
  viewModel$ = this.select();
}
```

* connect state slices & set initial state

```ts
// app-shell.component.ts

ngOnInit() {
  // set initial state
  this.set({
    genres: [],
    activeRoute: '',
    sideDrawerOpen: false
  });
  // connect state slices
  this.connect('genres', this.genres$);
  this.connect('activeRoute', this.activeRoute$);
  this.connect('sideDrawerOpen', this.toggleSideDrawer, (oldState) => {
    return !oldState.sideDrawerOpen
  });
}
```

* set `sideDrawerOpen` state on `closeSidenav`
```ts
closeSidenav() {
  this.set({ sideDrawerOpen: false });
}
```

* replace `sideDrawerOpen` occurrences in template

```html
<!-- app-shell.component.html -->

<app-side-drawer
  [opened]="vm.sideDrawerOpen"
  (openedChange)="closeSidenav()"
  *ngIf="viewModel$ | async as vm"
>
<!-- .. template .. -->
  
  <app-hamburger-button
    class="app-toolbar--action"
    (click)="toggleSideDrawer.next()"
  >
  </app-hamburger-button>
</app-side-drawer>
```
