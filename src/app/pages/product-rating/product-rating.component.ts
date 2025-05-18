import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-rating.component.html',
  styleUrls: ['./product-rating.component.scss']
})
export class ProductRatingComponent {
  @Input() initialRating: number = 0;
  @Input() readonly: boolean = false;
  @Input() showRatingText: boolean = true;
  @Input() ratingCount?: number;

  @Output() ratingChange = new EventEmitter<number>();
  @Output() ratingHover = new EventEmitter<number>();
  @Output() ratingLeave = new EventEmitter<void>();

  currentRating: number = 0;
  stars = new Array(5);

  ngOnInit() {
    this.currentRating = this.initialRating;
  }

  onRatingClick(rating: number): void {
    if (this.readonly) return;
    this.currentRating = rating;
    this.ratingChange.emit(rating);
  }

  onRatingHover(rating: number): void {
    if (this.readonly) return;
    this.ratingHover.emit(rating);
  }

  onRatingLeave(): void {
    if (this.readonly) return;
    this.ratingLeave.emit();
  }
} 