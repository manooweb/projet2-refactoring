import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { ErrorComponent } from '../components/error/error.component';
import { ERROR_MESSAGES } from '../constants/error-messages';

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss'],
    standalone: true,
    imports: [
      HeaderComponent,
      ErrorComponent
    ]
})

export class NotFoundPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  errorMessage: string = ERROR_MESSAGES.pageNotFound;

  ngOnInit() {
    this.errorMessage =
      this.route.snapshot.queryParamMap.get('errorMessage') ?? this.errorMessage;
  }
}
