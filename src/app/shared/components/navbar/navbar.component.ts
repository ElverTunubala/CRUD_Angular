import { Component, OnInit,  OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {
  public isCollapsed = true;
  public isAuthenticated = false;
  public currentUser: User | null = null;

  private destroy$ = new Subject<void>();

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$
    .pipe(takeUntil(this.destroy$))
    .subscribe(loggedIn => {
      this.isAuthenticated = loggedIn;
    });

    this.authService.currentUser$
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
