import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ROUTING_IMPORTS } from './app.routing';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { httpInterceptorProviders } from './data-access/interceptors/http-interceptor.providers';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppShellModule,
    ROUTING_IMPORTS
  ],
  providers: [
    httpInterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
