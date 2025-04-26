import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEdit = false;
  productId: number | null = null;
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProduct(id).subscribe(
      product => {
        this.productForm.patchValue(product);
        this.isLoading = false;
      },
      error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  get f() { return this.productForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    const productData = this.productForm.value;

    if (this.isEdit && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/products', this.productId]);
        },
        error => {
          console.error(error);
          this.isLoading = false;
        }
      );
    } else {
      this.productService.createProduct(productData).subscribe(
        (product) => {
          this.isLoading = false;
          this.router.navigate(['/products', product.id]);
        },
        error => {
          console.error(error);
          this.isLoading = false;
        }
      );
    }
  }
}