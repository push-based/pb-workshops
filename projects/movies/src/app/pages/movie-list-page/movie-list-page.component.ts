import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { EMPTY, map, Observable, startWith, switchMap } from 'rxjs';
import { MovieDataService } from '../../data-access/api/movie-data.service';
import { MovieModel } from '../../shared/model/index';


type RouterParams = {
  type: string;
  identifier: string;
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
  ]
})
export class MovieListPageComponent implements OnInit {
  movies: MovieModel[] = [];
  title: string = '';

  private routerParams$: Observable<RouterParams> = this.route.params as unknown as Observable<RouterParams>;


  constructor(
    private route: ActivatedRoute,
    private movieData: MovieDataService
  ) {

  }

  ngOnInit() {
    this.routerParams$.pipe(
      switchMap(({ identifier, type }) => {
        if (type === 'category') {
          return this.movieData.getMovieCategory(identifier).pipe(
            map(response => ({
              movies: response.results,
              title: identifier
            }))
          );
        } else if (type === 'genre') {
          return this.movieData.getMovieGenre(identifier).pipe(
            map(response => ({
              movies: response.results,
              title: identifier
            }))
          );
        }
        return EMPTY;
      }),
    ).subscribe(({ title, movies }) => {
      console.log(title);
      this.movies = movies;
      this.title = title;
    })
  }
}
