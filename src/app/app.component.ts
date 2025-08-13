import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './auth/auth.service';
import { HttpService } from './services/http.service';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'feedback-generator';
  private httpService = inject(HttpService);
  private authService = inject(AuthService);
  loading = this.httpService.autoLogLoading;

  ngOnInit() {
    this.authService.loadUser();
  }
}
