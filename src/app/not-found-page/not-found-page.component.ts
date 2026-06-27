import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { BackButtonComponent } from '../components/back-button/back-button.component';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
    standalone: true,
    imports: [
      HeaderComponent,
      BackButtonComponent
    ]
})

export class NotFoundPageComponent {
}
