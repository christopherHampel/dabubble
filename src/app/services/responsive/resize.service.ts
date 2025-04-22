import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  isSmallScreen: boolean = false;

  thisThreads = signal<boolean>(false);
  devSpaceClose = signal<boolean>(false);
  zIndexChats = signal<boolean>(false);
  wrapperMobile = signal<boolean>(false);
  mediaW960px: MediaQueryList = window.matchMedia("(max-width: 960px)");
  checkMediaW960pxSig = signal<boolean>(false);
  mediaW600px: MediaQueryList = window.matchMedia("(max-width: 600px)");
  checkMediaW600pxSig = signal<boolean>(false);
  mediaW370px: MediaQueryList = window.matchMedia("(max-width: 370px)");
  checkMediaW370pxSig = signal<boolean>(false);


  constructor() {
    this.checkWindowSize();
  }

  get checkMediaW960px() {
    return this.checkMediaW960pxSig();
  }

  get checkMediaW600px() {
    return this.checkMediaW600pxSig();
  }

  get checkMediaW370px() {
    return this.checkMediaW370pxSig();
  }

  checkWindowSize() {
    this.checkMediaW960pxSig.set(this.mediaW960px.matches);
    this.checkMediaW600pxSig.set(this.mediaW600px.matches);
    this.checkMediaW370pxSig.set(this.mediaW370px.matches);

    window.addEventListener('resize', () => {
      this.checkMediaW960pxSig.set(this.mediaW960px.matches);
      this.checkMediaW600pxSig.set(this.mediaW600px.matches);
      this.checkMediaW370pxSig.set(this.mediaW370px.matches);
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

  setThisThreads(value:boolean) {
    this.thisThreads.set(value);
  }

  checkSiteWidth(value: number) {
    this.checkScreenSize(value);
    if (this.isSmallScreen) {
      this.setZIndexChats(true);
    }
  }
}