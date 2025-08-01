import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { message } from './message-model';
import { StorageService } from './storage.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { environment } from '../../environments/environment';
import { contactMessage } from './contact-message-model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  loadingFeedback = signal(false);
  autoLogLoading = signal(false);
  private apiDomain = environment.apiUrl;
  private http = inject(HttpClient);
  storageService = inject(StorageService);
  authService = inject(AuthService);

  constructor() {}

  connectGPT(body: message) {
    const { productResults } = body;
    if (productResults?.length === 0) return;
    this.loadingFeedback.set(true);
    this.http
      .post<{
        feedback: string;
        prompt_tokens: number;
        completion_tokens: number;
        credits: number;
      }>(this.apiDomain + 'chat', { ...body }, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.storageService.chatResponse.set(res);
          this.loadingFeedback.set(false);
          return res;
        },
        error: (err) => {
          const errMessage =
            'Niestety nie możemy obecnie zrealizować tej usługi. Spróbuj ponownie później';
          this.storageService.chatResponse.set({
            feedback: errMessage + '\n' + err.msg,
            prompt_tokens: 0,
            completion_tokens: 0,
            credits: 0,
          });
        },
      });
  }

  getUser() {
    this.autoLogLoading.set(true);
    this.http
      .get<User>(this.apiDomain + 'users/showMe', { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.authService.user.set(res);
          this.autoLogLoading.set(false);
          return null;
        },
        error: (err) => {
          this.autoLogLoading.set(false);
        },
      });
  }

  sendContactMessage(customerMessage: contactMessage){
    return this.http
      .post<contactMessage>(this.apiDomain + 'contact', customerMessage)
  }
}
