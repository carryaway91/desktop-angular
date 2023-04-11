import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowSublist]'
})
export class ShowSublistDirective {
  @HostBinding('class.show') show = false

  @HostListener('mouseenter') showSublist() {
    setTimeout(() => {
      this.show = true
    }, 200)
  }

  @HostListener('mouseleave') removeSublist() {
    setTimeout(() => {
      this.show = false
    }, 200)
  }

  constructor() { }

}
