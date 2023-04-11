import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent {
  @Input('height') h: number;
  @Input('width') w: number;
  @Input('left') left: number;
  @Input('top') top: number;
  @Input('dir') dir: 'LTR' | 'RTL';
}
