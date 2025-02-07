import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  hasScrolled: boolean = false;
  private scrollContainer!: ElementRef;
  // private scrollContainers: ElementRef[] = [];


  constructor() { }

  setScrollContainer(container: ElementRef) {
    this.scrollContainer = container;
    // this.scrollContainers.push(container);

  }

  scrolling() {
    this.scrollToBottom();
    setTimeout(() => {
      this.scrollToBottom();
      this.hasScrolled = true;
    }, 100);
  }

  scrollToBottom(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
  // scrollToBottom(): void {
  //   this.scrollContainers.forEach(container => {
  //     container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
  //   });
  // }
}
