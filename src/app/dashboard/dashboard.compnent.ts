import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { message } from '../services/message-model';
import { HttpService } from '../services/http.service';
import { ChatResponseComponent } from '../chat-response/chat-response.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChatResponseComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidebar', { static: true }) sidebar!: ElementRef<HTMLElement>;
  @ViewChild('mainContent', { static: true })
  mainContent!: ElementRef<HTMLElement>;
  @ViewChild('sidebarToggle', { static: true })
  sidebarToggle!: ElementRef<HTMLElement>;
  @ViewChild('sidebarOverlay', { static: true })
  sidebarOverlay!: ElementRef<HTMLElement>;
  sensitivity = signal('średnia');
  historical = signal('ok. 100%');
  showOpeningSentence = signal(false);
  showClosingSentence = signal(false);
  showMoreOptions = signal(false);
  storageService = inject(StorageService);
  httpService = inject(HttpService);
  showResponse = this.storageService.showResponse;

  private destroy$ = new Subject<void>();
  private readonly BREAKPOINT_LG = 992;

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
  developmentActivities = this.formData.get('developmentActivities') as FormArray;

  ngOnInit(): void {
    this.setupResizeListener();
  }

  ngAfterViewInit(): void {
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupEventListeners(): void {
    // Toggle sidebar button
    if (this.sidebarToggle?.nativeElement) {
      fromEvent(this.sidebarToggle.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.toggleSidebar());
    }

    // Overlay click (close sidebar on mobile)
    if (this.sidebarOverlay?.nativeElement) {
      fromEvent(this.sidebarOverlay.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.closeSidebarOnMobile());
    }
  }

  private setupResizeListener(): void {
    fromEvent(window, 'resize')
      .pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe(() => this.handleResize());
  }

  toggleSidebar(): void {
    const isLargeScreen = window.innerWidth >= this.BREAKPOINT_LG;

    if (isLargeScreen) {
      this.sidebar.nativeElement.classList.toggle('hidden');
      this.mainContent.nativeElement.classList.toggle('sidebar-visible');
    } else {
      // Na małych ekranach - wysuwa się nad contentem
      this.sidebar.nativeElement.classList.toggle('show');
      this.sidebarOverlay.nativeElement.classList.toggle('show');
    }
  }

  private closeSidebarOnMobile(): void {
    this.sidebar.nativeElement.classList.remove('show');
    this.sidebarOverlay.nativeElement.classList.remove('show');
  }

  private handleResize(): void {
    const isLargeScreen = window.innerWidth >= this.BREAKPOINT_LG;

    if (isLargeScreen) {
      this.sidebar.nativeElement.classList.remove('show');
      this.sidebarOverlay.nativeElement.classList.remove('show');
    } else {
      this.sidebar.nativeElement.classList.remove('hidden');
      this.mainContent.nativeElement.classList.remove('sidebar-hidden');
      this.mainContent.nativeElement.classList.remove('sidebar-visible');
    }
  }

  onMenuItemClick(clickedItem: any): void {
    console.log('Selected menu item:', clickedItem.id);
  }

  onRemoveInput(index: number) {
    if (this.productResults.length === 1) return;
    this.productResults.removeAt(index);
  }

  onSubmit() {
    this.storageService.messageDetails.set(this.formData.value as message);
    this.httpService.connectGPT(this.formData.value as message);
    this.storageService.showResponse.set(true);
    console.log(this.formData.value);
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

  onClear() {
    this.formData.reset();
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

  onAddActivity() {
    this.developmentActivities.push(new FormControl());
  }
  onRemoveActivity(index: number) {
    this.developmentActivities.removeAt(index);
  }
}
