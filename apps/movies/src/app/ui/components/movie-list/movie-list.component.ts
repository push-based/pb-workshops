import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { MovieModel } from '../../../shared/model/index';
import { W300H450 } from '../../../shared/utils/image-sizes';
import { trackByProp } from '../../../shared/utils/track-by';

interface Movie extends MovieModel {
  url: string;
}

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieListComponent {
  W300H450 = W300H450;

  _movies: Movie[] = [];
  @Input()
  set movies(movies: MovieModel[]) {
    this._movies = movies?.map((m) => ({
      ...m,
      url: `https://image.tmdb.org/t/p/w${W300H450.WIDTH}/${m.poster_path}`,
    }));
  }

  @Input() adult?: string;

  @Input() movieLoading: Record<string, boolean> = {};

  @Output() ratingUpdated = new EventEmitter<{
    movie: MovieModel;
    rating: number;
  }>();

  get hasMovies(): boolean {
    return this._movies?.length > 0;
  }

  constructor(private router: Router) {}

  trackMovie = trackByProp<Movie>('id');

  toMovie(movie: Movie) {
    this.router.navigate(['/movie', movie.id]);
  }
}
