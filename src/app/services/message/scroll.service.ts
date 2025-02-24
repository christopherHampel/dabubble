import { ElementRef, Injectable, Query, QueryList } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  hasScrolled: boolean = false;
  hasScrolledDirectMessage = false
  private scrollContainer!: ElementRef;
  private scrollContainerThread!: ElementRef;
  constructor() { }

  setScrollContainer(container: ElementRef) {
    this.scrollContainer = container;    
  }

  setScrollContainerThread(container: ElementRef) {
    this.scrollContainerThread = container;    
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

    if(this.scrollContainerThread) {      
      this.scrollContainerThread.nativeElement.scrollTop = this.scrollContainerThread.nativeElement.scrollHeight;
    }
  }  
}
