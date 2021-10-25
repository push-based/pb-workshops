import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { MovieDataService } from '../data-access/api/movie-data.service';
import { MovieGenreModel } from '../shared/model/index';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnInit {

  sideDrawerOpen = false;

  activeRoute$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map((e) => e.urlAfterRedirects.split('?')[0])
  );

  genres: MovieGenreModel[] = [];

  constructor(
    private router: Router,
    private movieService: MovieDataService
  ) {
  }

  ngOnInit() {
    this.movieService.getGenres()
      .subscribe(response => {
        this.genres = response;
      });
  }

  navTo(path: string, args: (string | number)[], queryParams?: Record<string, any>) {
    this.closeSidenav();
    this.router.navigate([path, ...args], {queryParams});
  }

  closeSidenav() {
    this.sideDrawerOpen = false;
  }

}
