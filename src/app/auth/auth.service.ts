import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { User } from './user.model';
import { catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<User | null>(null);
  loading = signal(false);
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private apiDomain = environment.apiUrl;

  currentUser = signal<User | null>(null);

  async loadUser(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ user: User; credits: number }>(this.apiDomain + 'users/showMe', {
          withCredentials: true,
        })
      );

      this.currentUser.set(new User(res.user.name, res.user.id, res.user.role));
      this.storageService.credits.set(res.credits);
      this.storageService.chatResponse.update(prev => {
        return {
          feedback: '',
          prompt_tokens: 0,
          completion_tokens: 0,
          credits: res.credits,
        };
      });
    } catch (e) {
      this.currentUser.set(null);
    }
  }

  signUp(email: string, password: string, name: string) {
    return this.http
      .post<{ user: User; credits: number } | string>(this.apiDomain + 'auth/register', {
        email,
        password,
        name,
      })
      .pipe(catchError(this.handleError));
  }
  logIn(email: string, password: string) {
    return this.http
      .post<{ user: User; credits: number }>(
        this.apiDomain + 'auth/login',
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .pipe(catchError(this.handleError), tap(this.setUser.bind(this)));
  }

  logout() {
    this.storageService.chatResponse.update(prev => {
      return {
        feedback: '',
        prompt_tokens: 0,
        completion_tokens: 0,
        credits: 0,
      };
    });
    return this.http
      .delete(this.apiDomain + 'auth/logout', {
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Wystąpił błąd!';
    if (!error.error.msg) return throwError(() => new Error(errorMessage));

    errorMessage = error.error.msg;

    return throwError(() => new Error(errorMessage));
  }

  private setUser(resObj: { user: User; credits: number } | string) {
    if (typeof resObj === 'string') return;
    const { name, id, role } = resObj.user;
    this.currentUser.set(new User(name, id, role));
    this.user.set(this.currentUser());
    this.storageService.chatResponse.update(prev => {
      return {
        feedback: '',
        prompt_tokens: 0,
        completion_tokens: 0,
        credits: resObj.credits,
      };
    });
  }
}
