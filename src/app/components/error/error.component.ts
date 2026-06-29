import { Component, Input } from '@angular/core';
import { BackButtonComponent } from '../back-button/back-button.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [
    BackButtonComponent
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  @Input() errorMessage!: string;
  @Input() actionMessage!: string;
  @Input() isBackButton = true;

}
