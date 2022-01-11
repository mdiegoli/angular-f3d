import { Component, Input } from '@angular/core';

@Component({
  selector: 'f3d-tolerance',
  template: `
    Tolerance: <input type="number" [(ngModel)]="tolerance">
  `,
})
export class ToleranceComponent {
  @Input() tolerance: string;
}
