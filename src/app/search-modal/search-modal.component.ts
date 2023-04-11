import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css']
})
export class SearchModalComponent {
  @Input() showPanel: boolean;
  prevent(e: MouseEvent) {
    e.stopPropagation();
    e.stopImmediatePropagation()
  }
}
