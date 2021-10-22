import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeToggleComponent } from './dark-mode-toggle.component';

@NgModule({
  declarations: [DarkModeToggleComponent],
  exports: [DarkModeToggleComponent],
  imports: [CommonModule],
})
export class DarkModeToggleModule {}
