import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/index.php'; 

  private currentUser: User | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasUserInStorage());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.currentUser = this.loadUserFromStorage();
  }

  private hasUserInStorage(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  private loadUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login(email: string, password: string): Observable<User> {
    const url = `${this.apiUrl}?c=auth&m=login`;
    return this.http.post<any>(url, { email, password }).pipe(
      map(response => response.data), 
      tap(user => {
        this.setCurrentUser(user);  
      })
    );
  }
  
  register(user: Omit<User, 'id'>): Observable<User> {
    const url = `${this.apiUrl}?c=auth&m=register`;
    return this.http.post<User>(url, user);
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser || this.hasUserInStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
    this.currentUserSubject.next(user);
  }
}
