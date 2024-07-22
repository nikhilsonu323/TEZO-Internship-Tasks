import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appTrapFocus]',
  standalone: true
})
export class TrapFocusDirective implements OnInit, OnDestroy {
  private focusTrap: FocusTrap;
  @Input() focusElement?: HTMLElement;
  
  constructor(private elementRef: ElementRef, private focusTrapFactory: FocusTrapFactory) {
    this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
  }
  ngOnInit(){
    if(this.focusElement){
      this.focusElement.focus();
    }
  }

  ngOnDestroy() {
    if (this.focusTrap) {
      this.focusTrap.destroy();
    }
  }
}
