import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  hasScrolled: boolean = false;
  hasScrolledDirectMessage = false
  private scrollContainer!: ElementRef;
  constructor() { }

  setScrollContainer(container: ElementRef) {
    this.scrollContainer = container;
  }

  scrolling() {
    this.scrollToBottom();
    setTimeout(() => {
      this.scrollToBottom();
      this.hasScrolled = true;
      // this.hasScrolledDirectMessage = true;
    }, 100);
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
