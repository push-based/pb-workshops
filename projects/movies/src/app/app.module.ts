import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTING_IMPORTS } from './app.routing';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { httpInterceptorProviders } from './data-access/interceptors/http-interceptor.providers';
import { MovieDetailPageModule } from './pages/movie-detail-page/movie-detail-page.module';
import { MovieListPageModule } from './pages/movie-list-page/movie-list-page.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppShellModule,
    MovieListPageModule,
    MovieDetailPageModule,
    ROUTING_IMPORTS
  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
