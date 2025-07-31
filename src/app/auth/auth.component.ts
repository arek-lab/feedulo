import { Component, inject, input, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { CommonModule } from '@angular/common';
import { InfoComponent } from '../info/info.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, InfoComponent, LoaderComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  type = input();
  isLoading = signal(false);
  inactiveProfile = signal(false);
  error = signal<string | null>(null);
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  onSubmit() {
    if (this.type() === 'up' && this.authForm.invalid) return;
    if (
      this.type() === 'in' &&
      (this.authForm.controls.email.invalid ||
        this.authForm.controls.password.invalid)
    )
      return;
    this.isLoading.set(true);
    const { email, password, name } = this.authForm.value;
    let authObs!: Observable<{ user: User; credits: number } | string>;
    this.type() === 'in'
      ? (authObs = this.authService.logIn(email as string, password as string))
      : (authObs = this.authService.signUp(
          email as string,
          password as string,
          name as string
        ));

    authObs.subscribe({
      next: (resData) => {
        if (this.type() === 'in') this.router.navigate(['dashboard']);
        this.isLoading.set(false);
        this.inactiveProfile.set(true);
      },
      error: (errorMessage) => {
        this.isLoading.set(false);
        this.error.set(errorMessage);
      },
    });
    this.authForm.reset();
  }
}
