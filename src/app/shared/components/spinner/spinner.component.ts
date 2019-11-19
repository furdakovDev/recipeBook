import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<div [ngStyle]="heightStyle" class="loader-wrap"><div class="lds-dual-ring"></div></div>`,
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnChanges {
  @Input() height: string;
  heightStyle: { height: string };

  ngOnChanges(changes: SimpleChanges): void {
    const height = changes.height;
    if (height && height.currentValue) {
      if (!this.heightStyle) {
        this.setHeight();
      }
    }
  }

  setHeight() {
    this.heightStyle = {
      height: this.height,
    };
  }
}
