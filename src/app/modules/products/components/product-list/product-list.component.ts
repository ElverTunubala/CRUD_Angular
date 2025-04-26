import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;

  constructor(
    private productService: ProductService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      products => {
        this.products = products;
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error => {
          console.error(error);
        }
      );
    }
  }
}