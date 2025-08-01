import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { contactMessage } from '../services/contact-message-model';
import { phoneNumberValidator } from './validators';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private httpService = inject(HttpService)
  @ViewChild('featuresSection') featuresSection!: ElementRef;
  @ViewChild('home') home!: ElementRef;
  @ViewChild('contact') contact!: ElementRef;
  showConfirm = signal<string | null>(null)

  scrollTo(place: string) {
    let element: ElementRef
    switch (place) {
      case 'features':
        element = this.featuresSection;
        break
      case 'home':
        element = this.home;
        break
      case 'contact':
        element = this.contact;
    }
    element!.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  contactForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('', phoneNumberValidator()),
    message: new FormControl('', {validators: [Validators.required, Validators.minLength(10)]})
  });

  onSubmit(){
    const customerQuery = {...this.contactForm.value}
    this.httpService
      .sendContactMessage(customerQuery as contactMessage)
      .subscribe({
        next: res => { 
          this.showConfirm.set('Wysłano poprawnie!');
          setTimeout(()=>{
            this.contactForm.reset();
            this.scrollTo('home');
          }, 1000)  
        },
        error: err => {
          this.showConfirm.set('Wystąpił nieoczekiwany błąd, spróbuj ponownie')
        }
      });
    
  }
}
