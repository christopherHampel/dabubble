import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  isSmallScreen: boolean = false;
  devSpaceClose = signal<boolean>(false);
  zIndexChats = signal<boolean>(false);
  wrapperMobile = signal<boolean>(false);
  mediaW960px: MediaQueryList = window.matchMedia("(max-width: 960px)");
  checkMediaW960px = signal<boolean>(false);
  mediaW600px: MediaQueryList = window.matchMedia("(max-width: 600px)");
  checkMediaW600px = signal<boolean>(false);


  constructor() {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.checkMediaW960px.set(this.mediaW960px.matches);
    this.checkMediaW600px.set(this.mediaW600px.matches);

    window.addEventListener('resize', () => {
      this.checkMediaW960px.set(this.mediaW960px.matches);
      this.checkMediaW600px.set(this.mediaW600px.matches);
    });
  }

  setDevSpaceClose(value: boolean) {
    this.devSpaceClose.set(value);
  }

  checkDevspaceOpen() {
    this.checkScreenSize(1440);
    if (this.isSmallScreen) {
      this.setDevSpaceClose(true)
    }
  }

  checkScreenSize(value: number) :boolean {
    this.isSmallScreen = window.innerWidth < value;
    return this.isSmallScreen;
  }

  setZIndexChats(value: boolean) {
    this.zIndexChats.set(value);
  }

  setMobileWrapper(value: boolean) {
    this.wrapperMobile.set(value);
  }

  checkSiteWidth(value: number) {
    this.checkScreenSize(value);
    if (this.isSmallScreen) {
      this.setZIndexChats(true);
    }
  }
}
