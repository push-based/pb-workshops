import { RouterModule, Routes } from '@angular/router';

const ROUTES: Routes = [
  { path: '**', redirectTo: 'list/category/popular' }
];

export const ROUTING_IMPORTS = [
  RouterModule.forRoot(ROUTES, {
    initialNavigation: 'enabled',
    onSameUrlNavigation: 'reload',
    relativeLinkResolution: 'legacy'
  })
];
