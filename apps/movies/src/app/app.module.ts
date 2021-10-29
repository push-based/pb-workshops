import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTING_IMPORTS } from './app.routing';
import { AppComponent } from './app.component';
import { AppShellModule } from '@movies/movies/feature-app-shell';
import { httpInterceptorProviders } from '@movies/shared/data-access';
import { AbstractMovieState } from '@movies/shared/data-access';
import { MovieStateService } from '@movies/shared/data-access';
import { SpecialMovieStateService } from '@movies/shared/data-access';
import { MovieDetailPageModule } from '@movies/movies/feature-movie-detail';
import { MovieListPageModule } from '@movies/movies/feature-movie-list';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppShellModule,
    MovieListPageModule,
    MovieDetailPageModule,
    ROUTING_IMPORTS,
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: AbstractMovieState,
      useExisting: MovieStateService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
