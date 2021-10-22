import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RX_ANGULAR_CONFIG } from '@rx-angular/cdk';

import { ROUTING_IMPORTS } from './app.routing';
import { AppComponent } from './app.component';
import { AppShellModule } from './app-shell/app-shell.module';
import { customStrategyCredentials } from './shared/utils/custom-strategies';
import { httpInterceptorProviders } from './data-access/auth/http-interceptor.providers';
import { stateAppInitializerProvider } from './shared/state/state-app-initializer.provider';

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
    stateAppInitializerProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
