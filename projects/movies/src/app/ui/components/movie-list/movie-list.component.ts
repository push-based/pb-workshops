import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MovieModel } from '../../../shared/model/index';
import { W300H450 } from '../../../shared/utils/image-sizes';

interface Movie extends MovieModel {
  url: string;
}

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  W300H450 = W300H450;

  _movies: Movie[] = [];
  @Input()
  set movies(movies: MovieModel[]) {
    this._movies = movies?.map(m => ({
      ...m,
      url: `https://image.tmdb.org/t/p/w${W300H450.WIDTH}/${m.poster_path}`,
    }));
  }

  @Input() adult?: string;

  get hasMovies(): boolean {
    return this._movies?.length > 0;
  }

  constructor(
    private router: Router
  ) {}

  toMovie(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }
}
