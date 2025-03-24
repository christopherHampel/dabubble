import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-police',
  imports: [ ],
  templateUrl: './privacy-police.component.html',
  styleUrl: './privacy-police.component.scss'
})
export class PrivacyPoliceComponent {

  constructor(private location: Location) {}

  locationBack() {
    this.location.back();
  }

}
