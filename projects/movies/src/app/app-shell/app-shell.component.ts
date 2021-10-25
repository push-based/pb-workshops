import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';
import { MovieDataService } from '../data-access/api/movie-data.service';
import { MovieGenreModel } from '../shared/model/index';
import { trackByProp } from '../shared/utils/track-by';

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
  ) {
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

  trackGenre = trackByProp<MovieGenreModel>('name');

  ngOnInit() {}

  navTo(path: string, args: (string | number)[], queryParams?: Record<string, any>) {
    this.closeSidenav();
    this.router.navigate([path, ...args], {queryParams});
  }

  closeSidenav() {
    this.sideDrawerOpen = false;
  }

}
