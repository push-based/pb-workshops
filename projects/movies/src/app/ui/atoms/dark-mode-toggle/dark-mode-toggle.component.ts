import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dark-mode-toggle',
  template: `
    <div class="dark-mode-toggle">
      <button type="button" class="light" (click)="toggleLightMode(true)">☀</button>

      <span class="toggle">
        <input
          class="toggle-track"
          type="checkbox"
          id="dark-mode"
          [checked]="isLightTheme"
          (change)="toggleLightMode(!isLightTheme)"
        />
        <label style="color: transparent" for="dark-mode">
          Toggle Switch
        </label>
      </span>

      <button type="button" class="dark" (click)="toggleLightMode(false)">☾</button>
    </div>
  `,
  styleUrls: ['dark-mode-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkModeToggleComponent {

  isLightTheme = true;

  toggleLightMode(isLightTheme: boolean): void {
    if (isLightTheme) {
      window.document.body.classList.remove('dark');
      window.document.body.classList.add('light');
    } else {
      window.document.body.classList.add('dark');
      window.document.body.classList.remove('light');
    }
    this.isLightTheme = isLightTheme;
  }
}
