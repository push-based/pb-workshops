import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { MovieDataService } from '../../data-access/api/movie-data.service';
import { MovieModel } from '../../shared/model/index';


type RouterParams = {
  type: string;
  identifier: 'category' | 'genre';
};

@Component({
  selector: 'app-movies',
  templateUrl: './movie-list-page.component.html',
  styles: [
      `
      :host {
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListPageComponent implements OnInit {
  title: string = '';

  private routerParams$: Observable<RouterParams> = this.route.params as unknown as Observable<RouterParams>;

  movies$: Observable<MovieModel[]> = this.routerParams$.pipe(
    switchMap(({ identifier, type }) => {
      switch (type) {
        case 'category':
          return this.movieData.getMovieCategory(identifier).pipe(
            map(response => response.results)
          );
        case 'genre':
          return this.movieData.getMovieGenre(identifier).pipe(
            map(response => response.results)
          );
        default:
          return EMPTY;
      }
    }),
  );

  constructor(
    private route: ActivatedRoute,
    private movieData: MovieDataService
  ) {

  }

  ngOnInit() {}
}
