import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../auth/user.model';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  user = this.authService.currentUser;
  llmResponse = this.storageService.chatResponse;
  @ViewChild('navbarCollapse', { static: true }) navbarCollapse!: ElementRef;

  constructor() {
    effect(
      () => {
        this.llmResponse = this.storageService.chatResponse;
      },
      { allowSignalWrites: true }
    );
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
        this.closeMenu();
        this.authService.user.set(null);
        this.authService.loadUser();
      },
      error: err => {
        console.log(err);
      },
    });
  }

  scrollTo(place: string): void {
    const currentUrl = this.router.url;

    if (currentUrl === '/' || currentUrl.startsWith('/home')) {
      const scrollElement = document.querySelector(`#${place}`);
      if (scrollElement) {
        scrollElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        this.closeMenu();
      }
    } else {
      this.router.navigate(['/home'], { fragment: place });
      this.closeMenu();
    }
  }
}
