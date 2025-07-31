import { Component, effect, inject, signal } from '@angular/core';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';
import { JsonPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat-response',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './chat-response.component.html',
  styleUrl: './chat-response.component.css',
})
export class ChatResponseComponent {
  private httpService = inject(HttpService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  chatResponse = this.storageService.chatResponse;
  isLoading = this.httpService.loadingFeedback;
  messageDetails = this.storageService.messageDetails;
  productList = this.messageDetails()?.productResults || [];
  isProduct = false;
  colorsList = [
    'Ewolucyjny Turkus',
    'Pluralistyczna Zieleń',
    'Oranż Osiągnięć',
    'Konformistyczny Bursztyn',
    'Impulsywna Czerwień',
  ];
  sensitivityList = [
    'bardzo niska',
    'niska',
    'średnia',
    'wysoka',
    'bardzo wysoka',
  ];
  historicalList = ['<80%', '80%-100%', 'ok 100%', '100% - 120%', '>120%'];
  managementColor = signal('');
  developmentActivities = signal<any>([]);
  copied = false;

  constructor() {
    effect(
      () => {
        this.messageDetails = this.storageService.messageDetails;
        this.productList = this.messageDetails()?.productResults || [];
        this.isProduct =
          this.productList[0]?.product !== '' &&
          this.productList[0]?.result !== '';
        this.managementColor.set(
          this.colorsList[+this.messageDetails()?.colors! - 1]
        );
        this.developmentActivities.set(
          this.messageDetails()?.developmentActivities
        );
      },
      { allowSignalWrites: true }
    );
  }

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.chatResponse()?.feedback as string)
      .then(() => (this.copied = true))
      .catch((err) => alert('Nie udało się skopiować'));
  }

  editMode() {
    this.storageService.isEditingMode.set(true);
    this.router.navigate(['dashboard']);
  }
}
