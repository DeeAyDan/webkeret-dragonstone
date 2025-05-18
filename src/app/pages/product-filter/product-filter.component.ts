import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'rating';
  sortDirection?: 'asc' | 'desc';
}

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-container">
      <div class="filter-section">
        <label>Category:</label>
        <select [(ngModel)]="selectedCategory" (change)="onFilterChange()">
          <option value="">All Categories</option>
          <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="filter-section">
        <label>Price Range:</label>
        <div class="price-inputs">
          <input 
            type="number" 
            [(ngModel)]="minPrice" 
            (change)="onFilterChange()"
            placeholder="Min"
            [min]="0"
          >
          <span>-</span>
          <input 
            type="number" 
            [(ngModel)]="maxPrice" 
            (change)="onFilterChange()"
            placeholder="Max"
            [min]="0"
          >
        </div>
      </div>

      <div class="filter-section">
        <label>Sort By:</label>
        <select [(ngModel)]="sortBy" (change)="onFilterChange()">
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
        <select [(ngModel)]="sortDirection" (change)="onFilterChange()">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <button (click)="onClearFilters()">Clear Filters</button>
    </div>
  `,
  styles: [`
    .filter-container {
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .price-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    input, select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #0056b3;
    }
  `]
})
export class ProductFilterComponent {
  @Input() categories: string[] = [];
  @Input() initialFilters?: FilterOptions;
  @Input() maxPriceLimit?: number;

  @Output() filterChange = new EventEmitter<FilterOptions>();
  @Output() clearFilters = new EventEmitter<void>();
  @Output() invalidFilter = new EventEmitter<string>();

  selectedCategory: string = '';
  minPrice?: number;
  maxPrice?: number;
  sortBy: 'price' | 'name' | 'rating' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    if (this.initialFilters) {
      this.selectedCategory = this.initialFilters.category || '';
      this.minPrice = this.initialFilters.minPrice;
      this.maxPrice = this.initialFilters.maxPrice;
      this.sortBy = this.initialFilters.sortBy || 'name';
      this.sortDirection = this.initialFilters.sortDirection || 'asc';
    }
  }

  onFilterChange(): void {
    // Validate price range
    if (this.minPrice && this.maxPrice && this.minPrice > this.maxPrice) {
      this.invalidFilter.emit('Min price cannot be greater than max price');
      return;
    }

    if (this.maxPriceLimit && this.maxPrice && this.maxPrice > this.maxPriceLimit) {
      this.invalidFilter.emit(`Max price cannot exceed ${this.maxPriceLimit}`);
      return;
    }

    this.filterChange.emit({
      category: this.selectedCategory || undefined,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    });
  }

  onClearFilters(): void {
    this.selectedCategory = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.sortBy = 'name';
    this.sortDirection = 'asc';
    this.clearFilters.emit();
    this.onFilterChange();
  }
} 