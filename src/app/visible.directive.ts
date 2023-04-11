import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[visibility]'
})
export class VisibleDirective {
  @HostBinding('class.visible') visible = false;

  @HostListener('contextmenu') isVisible() {
    this.visible = !this.visible
  }
  constructor(private el: ElementRef) { }



}
