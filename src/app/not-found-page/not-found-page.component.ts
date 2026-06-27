import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
    standalone: true,
    imports: [
      RouterLink,
      HeaderComponent
    ]
})

export class NotFoundPageComponent {
}
