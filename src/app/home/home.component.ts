import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild('featuresSection') featuresSection!: ElementRef;

  scrollToFeatures() {
    this.featuresSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
