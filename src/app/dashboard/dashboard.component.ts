import { Component, signal, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { message } from '../services/message-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private httpService = inject(HttpService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  showOpeningSentence = signal(false);
  showClosingSentence = signal(false);
  showMoreOptions = signal(false);
  sensitivity = signal('średnia');
  historical = signal('ok. 100%');
  isEditingMode = this.storageService.isEditingMode;
  sidebarOpen = false;
  isMobile = false;

  formData = new FormGroup({
    sensitivity: new FormControl('2'),
    ignoreSensitivity: new FormControl(false),
    historical: new FormControl('2'),
    ignoreHistorical: new FormControl(false),
    productResults: new FormArray([
      new FormGroup({
        product: new FormControl('', {
          validators: [Validators.required, Validators.minLength(3)],
        }),
        result: new FormControl('', Validators.required),
        additional: new FormControl(''),
      }),
    ]),
    developmentActivities: new FormArray<FormControl<string>>([]),
    openingSentence: new FormControl(''),
    closingSentence: new FormControl(''),
    colors: new FormControl<string>('3'),
    emotions: new FormControl(''),
    moreInfos: new FormControl(''),
    numberOfWords: new FormControl('100'),
  });

  productResults = this.formData.get('productResults') as FormArray;
  developmentActivities = this.formData.get(
    'developmentActivities'
  ) as FormArray;

  ngOnInit(): void {
    this.checkScreenSize();
    if (!this.isEditingMode()) return;
    this.fillForm();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Bootstrap md breakpoint
    if (!this.isMobile) {
      this.sidebarOpen = true; // auto show on desktop
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onAddInputs() {
    this.productResults.push(
      new FormGroup({
        product: new FormControl(''),
        result: new FormControl(''),
        additional: new FormControl(''),
      })
    );
  }
  onAddActivity() {
    this.developmentActivities.push(new FormControl());
  }

  onRemoveInput(index: number) {
    if (this.productResults.length === 1) return;
    this.productResults.removeAt(index);
  }
  onRemoveActivity(index: number) {
    this.developmentActivities.removeAt(index);
  }

  onSubmit() {
    this.storageService.messageDetails.set(this.formData.value as message);
    this.httpService.connectGPT(this.formData.value as message);
    this.router.navigate(['/feedback']);
  }
  onClear() {
    this.formData.reset();
    this.sensitivity.set('średnia');
    this.historical.set('ok. 100%');
  }

  sensitivityChange(event: any) {
    switch (event.target.value) {
      case '0':
        this.sensitivity.set('bardzo niska');
        break;
      case '1':
        this.sensitivity.set('niska');
        break;
      case '2':
        this.sensitivity.set('średnia');
        break;
      case '3':
        this.sensitivity.set('wysoka');
        break;
      case '4':
        this.sensitivity.set('bardzo wysoka');
        break;
    }
  }
  historicalChange(event: any) {
    switch (event.target.value) {
      case '0':
        this.historical.set('<80%');
        break;
      case '1':
        this.historical.set('80%-100%');
        break;
      case '2':
        this.historical.set('ok. 100%');
        break;
      case '3':
        this.historical.set('100%-120%');
        break;
      case '4':
        this.historical.set('>120%');
        break;
    }
  }
  addPercentSign(event: any) {
    // if (event.target.value.endsWith('%')) return;
    // event.target.value += '%';
  }

  fillForm() {
    const messageDetails = this.storageService.messageDetails();

    if (messageDetails) {
      const {
        sensitivity,
        ignoreSensitivity,
        historical,
        ignoreHistorical,
        productResults,
        developmentActivities,
        openingSentence,
        closingSentence,
        colors,
        emotions,
        moreInfos,
        numberOfWords,
      } = messageDetails;
      this.formData.patchValue({
        sensitivity,
        ignoreSensitivity,
        historical,
        ignoreHistorical,
        productResults,
        developmentActivities,
        openingSentence,
        closingSentence,
        colors,
        emotions,
        moreInfos,
        numberOfWords,
      });
      this.setProductResults(messageDetails.productResults);
      this.setDevelopmentActivities(messageDetails.developmentActivities);
    }
  }

  setProductResults(results: any[]) {
    const productResultsArray = this.formData.get(
      'productResults'
    ) as FormArray;
    productResultsArray.clear();

    results.forEach(result => {
      productResultsArray.push(
        new FormGroup({
          product: new FormControl(result.product ?? null),
          result: new FormControl(result.result ?? null),
          additional: new FormControl(result.additional ?? null),
        })
      );
    });
  }
  setDevelopmentActivities(activities: any[]) {
    const developmentActivitiesArray = this.formData.get(
      'developmentActivities'
    ) as FormArray;
    developmentActivitiesArray.clear();

    activities.forEach(activity => {
      developmentActivitiesArray.push(new FormControl(activity));
    });
  }
}
