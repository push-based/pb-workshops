import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MovieStateService } from './movie-state.service';

@Injectable({ providedIn: 'root' })
export class SpecialMovieStateService extends MovieStateService {

  genres$ = this.select('genres').pipe(
    map(genres => genres.map(g => ({
      ...g,
      name: `special ${g.name}`
    })))
  )

}
