import { Injectable, signal } from '@angular/core';
import { ThreadsDbService } from '../message/threads-db.service';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  isSmallScreen: boolean = false;
  devSpaceClose = signal<any>(false);

  constructor(private threadsDb: ThreadsDbService) { }

  setDevSpaceClose(value:boolean) {
    this.devSpaceClose.set(value);
  }

  checkDevspaceOpen() {
    this.checkScreenSize();
    if(this.isSmallScreen) {
      this.setDevSpaceClose(true)
    }
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1440;
  }
}
