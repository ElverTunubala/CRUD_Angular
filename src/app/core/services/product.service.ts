import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8000/index.php?c=products&m=';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<{ status: number; data: Product[]; error: any }>(`${this.baseUrl}read`)
      .pipe(
        map(response => response.data)
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http
    .get<{ status: number; data: Product; error: any }>(`${this.baseUrl}read_one&id=${id}`)
    .pipe(
      map(response => response.data)
    );
  }
  
  createProduct(product: Omit<Product, 'id' | 'createdAt'>): Observable<Product> {
    return this.http
      .post<{ status: number; data: Product; error: any }>(`${this.baseUrl}create`, product)
      .pipe(
        map(response => response.data)
      );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    // Se puede enviar el ID dentro del body o agregarlo como parámetro
    const payload = { id, ...product };
    return this.http.put<Product>(`${this.baseUrl}update`, payload);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.request<void>('delete', `${this.baseUrl}delete`, {
      body: { id }
    });
  }
}
