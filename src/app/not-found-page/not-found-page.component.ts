import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { ActivatedRoute } from '@angular/router';

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

export class NotFoundPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  
  errorMessage = 'No corresponding page found';

  ngOnInit() {
    this.errorMessage =
      this.route.snapshot.queryParamMap.get('errorMessage') ?? this.errorMessage;
  }
}