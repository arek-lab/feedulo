import { Injectable, signal } from '@angular/core';
import { message } from './message-model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  messageDetails = signal<message | null>(null);
  chatResponse = signal<{
    feedback: string;
    prompt_tokens: number;
    completion_tokens: number;
    credits: number;
  } | null>(null);
  credits = this.chatResponse()?.credits;
  isEditingMode = signal(false);
  constructor() {}
}
