import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../auth/user.model';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  user = signal<User | null>(null);
  llmResponse = this.storageService.chatResponse;
  @ViewChild('navbarCollapse', { static: true }) navbarCollapse!: ElementRef;

  constructor() {
    effect(() => {
      this.user = this.authService.user;
      this.llmResponse = this.storageService.chatResponse;
    });
  }
  closeMenu() {
    const collapseElement = this.navbarCollapse.nativeElement;
    if (collapseElement.classList.contains('show')) {
      collapseElement.classList.remove('show');
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['auth', 'in']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
