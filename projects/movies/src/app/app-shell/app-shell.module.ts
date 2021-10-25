import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirtyCheckComponentModule } from '../ui/atoms/dirty-check/dirty-check.component';
import { HamburgerButtonModule } from '../ui/atoms/hamburger-button/hamburger-button.component';
import { SearchBarComponentModule } from '../ui/atoms/search-bar/search-bar.component';
import { SideDrawerComponentModule } from '../ui/atoms/side-drawer/side-drawer.component';
import { AppShellComponent } from './app-shell.component';
import { RouterModule } from '@angular/router';
import { DarkModeToggleModule } from '../ui/atoms/dark-mode-toggle/dark-mode-toggle.module';

@NgModule({
  declarations: [AppShellComponent],
    imports: [
        CommonModule,
        RouterModule,
        HamburgerButtonModule,
        SideDrawerComponentModule,
        SearchBarComponentModule,
        DarkModeToggleModule,
        DirtyCheckComponentModule
    ],
  exports: [AppShellComponent],
})
export class AppShellModule {}
