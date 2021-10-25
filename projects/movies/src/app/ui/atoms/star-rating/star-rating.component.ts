import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import {
  coerceNumberProperty,
} from '@angular/cdk/coercion';

const range = 10;
const numStars = 5;
const starsArray: number[] = new Array(numStars).fill(1);

@Component({
  selector: 'app-star-rating',
  template: `
    <span class="tooltip">
        {{ tooltipText }}
      </span>
    <div class="stars">
        <span
          *ngFor="let fill of stars; trackBy: trackByIndex"
          class="star"
          [ngClass]="{
            'star-half': fill === 0,
            'star-empty': fill === -1
          }"
          style
        >★</span
        >
    </div>
    <div class="rating-value" *ngIf="showRating">{{ rating }}</div>
  `,
  styleUrls: ['star-rating.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent {
  stars: number[] = starsArray;
  tooltipText = `0 average rating`;
  trackByIndex = (index: number) => index;

  @Input() showRating = false;

  private _rating = 5;
  @Input()
  set rating(rating: number | undefined) {
    this._rating = coerceNumberProperty(rating);

    this.setToolTopText(this.rating);

    const scaledRating =
      coerceNumberProperty(rating, 0) / (range / numStars);
    const full = Math.floor(scaledRating);
    const half = scaledRating % 1 > 0 ? 1 : 0;
    const empty = numStars - full - half;
    this.stars = new Array(full)
      .fill(1)
      .concat(new Array(half).fill(0))
      .concat(new Array(empty).fill(-1));
  }
  get rating(): number {
    return this._rating;
  }

  setToolTopText(rating: number) {
    this.tooltipText = `${rating} average rating`;
  }
}
