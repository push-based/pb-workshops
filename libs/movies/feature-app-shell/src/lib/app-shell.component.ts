import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { filter, map, Subject } from 'rxjs';
import { AbstractMovieState } from '@movies/shared/data-access';
import { MovieGenreModel } from '@movies/shared/models';
import { trackByProp } from '@movies/shared/util';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent
  extends RxState<{
    activeRoute: string;
    genres: MovieGenreModel[];
    sideDrawerOpen: boolean;
  }>
  implements OnInit
{
  viewModel$ = this.select();

  toggleSideDrawer = new Subject<void>();

  private activeRoute$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map((e) => e.urlAfterRedirects.split('?')[0])
  );

  constructor(private router: Router, private movieState: AbstractMovieState) {
    super();
  }

  trackGenre = trackByProp<MovieGenreModel>('name');

  ngOnInit() {
    this.set({
      genres: [],
      activeRoute: '',
      sideDrawerOpen: false,
    });
    this.connect('genres', this.movieState.genres$);
    this.connect('activeRoute', this.activeRoute$);
    this.connect('sideDrawerOpen', this.toggleSideDrawer, (oldState) => {
      return !oldState.sideDrawerOpen;
    });
  }

  navTo(
    path: string,
    args: (string | number)[],
    queryParams?: Record<string, any>
  ) {
    this.closeSidenav();
    this.router.navigate([path, ...args], { queryParams });
  }

  closeSidenav() {
    this.set({ sideDrawerOpen: false });
  }
}
