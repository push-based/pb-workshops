import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-shell>
      <router-outlet></router-outlet>
    </app-shell>
  `
})
export class AppComponent {
}
