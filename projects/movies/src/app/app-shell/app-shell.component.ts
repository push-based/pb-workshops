import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';
import { MovieDataService } from '../data-access/api/movie-data.service';
import { MovieGenreModel } from '../shared/model/index';
import { trackByProp } from '../shared/utils/track-by';

interface AppShellState {
  activeRoute: string;
  genres: MovieGenreModel[]
}

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent implements OnInit {

  sideDrawerOpen = false;

  private state$ = new BehaviorSubject<{
    activeRoute: string;
    genres: MovieGenreModel[]
  }>({
    activeRoute: '',
    genres: []
  });

  viewModel$ = this.state$;

  private activeRoute$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map((e) => e.urlAfterRedirects.split('?')[0])
  );

  private genres$ = this.movieService.getGenres();

  constructor(
    private router: Router,
    private movieService: MovieDataService
  ) {}

  trackGenre = trackByProp<MovieGenreModel>('name');

  ngOnInit() {
    this.genres$
      .subscribe(genres => {
        this.setState('genres', genres);
      });
    this.activeRoute$.subscribe(activeRoute => {
      this.setState('activeRoute', activeRoute);
    });
  }

  navTo(path: string, args: (string | number)[], queryParams?: Record<string, any>) {
    this.closeSidenav();
    this.router.navigate([path, ...args], {queryParams});
  }

  closeSidenav() {
    this.sideDrawerOpen = false;
  }

  setState<K extends keyof AppShellState>(prop: K, value: AppShellState[K]) {
    this.state$.next({
      ...this.state$.getValue(),
      [prop]: value
    })
  }

}
