import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = +this.route.snapshot.params['id'];

    this.productService.getProduct(id).subscribe(
      product => {
        this.product = product;
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.product = null;
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    );
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.router.navigate(['/products']);
        },
        error => {
          console.error('Error deleting product:', error);
          alert('There was an error deleting the product.');
        }
      );
    }
  }
}
