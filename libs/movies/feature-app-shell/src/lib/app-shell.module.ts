import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirtyCheckComponentModule } from '@movies/shared/ui';
import { HamburgerButtonModule } from '@movies/shared/ui';
import { SearchBarComponentModule } from '@movies/shared/ui';
import { SideDrawerComponentModule } from '@movies/shared/ui';
import { AppShellComponent } from './app-shell.component';
import { RouterModule } from '@angular/router';
import { DarkModeToggleModule } from '@movies/shared/ui';

@NgModule({
  declarations: [AppShellComponent],
  imports: [
    CommonModule,
    RouterModule,
    HamburgerButtonModule,
    SideDrawerComponentModule,
    SearchBarComponentModule,
    DarkModeToggleModule,
    DirtyCheckComponentModule,
  ],
  exports: [AppShellComponent],
})
export class AppShellModule {}
