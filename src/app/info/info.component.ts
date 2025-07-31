import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css',
})
export class InfoComponent {
  header = input.required();
  title = input.required();
  content = input.required();
}
