import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() productClick = new EventEmitter<Product>();

  onClick(){
    this.productClick.emit(this.product);
  }

  
}
