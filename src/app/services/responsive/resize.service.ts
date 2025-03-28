import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  isSmallScreen: boolean = false;
  devSpaceClose = signal<boolean>(false);
  zIndexChats = signal<boolean>(false);
  wrapperMobile = signal<boolean>(false); 

  constructor() { }

  setDevSpaceClose(value:boolean) {
    this.devSpaceClose.set(value);
  }

  checkDevspaceOpen() {
    this.checkScreenSize(1440);
    if(this.isSmallScreen) {
      this.setDevSpaceClose(true)
    }
  }

  checkScreenSize(value:number) {
    this.isSmallScreen = window.innerWidth < value && window.innerWidth > 960;
  }

  setZIndexChats(value:boolean) {
    this.zIndexChats.set(value);
  }

  setMobileWrapper(value:boolean) {
    this.wrapperMobile.set(value);
  }
}
