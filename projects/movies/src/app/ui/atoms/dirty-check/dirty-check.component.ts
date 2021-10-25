import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-dirty-check',
  template: `{{ check() }}`,
  styles: [`
    :host {
      padding: 4px;
      text-align: center;
      border: 1px solid var(--palette-secondary-main);
      width: 25px;
      height: 25px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
    }
  `]
})
export class DirtyCheckComponent {
  private _checked = 0;
  check() {
    return this._checked++;
  }
}
// obsolete in v13 (experimental)
@NgModule({
  imports: [],
  exports: [DirtyCheckComponent],
  declarations: [DirtyCheckComponent],
})
export class DirtyCheckComponentModule {}
