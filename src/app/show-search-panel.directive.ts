import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowSearchPanel]'
})
export class ShowSearchPanelDirective {
  @HostBinding('class.showPanel') showPanel = false;

  @HostListener('focus') hidePanel() {
    this.showPanel = false
  }
  constructor() { }

}
