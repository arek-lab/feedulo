 import {
   Component,
   OnInit,
   OnDestroy,
   ElementRef,
   ViewChild,
   AfterViewInit,
 } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { fromEvent, Subject } from 'rxjs';
 import { takeUntil, debounceTime } from 'rxjs/operators';

 @Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule],
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

   private destroy$ = new Subject<void>();
   private readonly BREAKPOINT_LG = 992;


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
 }