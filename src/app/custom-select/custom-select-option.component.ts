import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';

import { CustomSelectComponent } from './custom-select.component';
import { CustomSelectService } from './custom-select.service';

@Component({
  selector: 'custom-select-option',
  templateUrl: './custom-select-option.component.html',
  styleUrls: ['./custom-select-option.component.scss'],
  host: {
    role: 'listbox',
    '[attr.aria-label]': 'value',
  },
})
export class CustomSelectOptionComponent {
  @Input()
  public value!: any;

  private select: CustomSelectComponent;

  @ViewChild('option')
  private option!: ElementRef;

  private _isSelected: boolean = false;

  get isSelected(): boolean {
    return this._isSelected;
  }

  check(): void {
    this._isSelected = true;
  }

  unCheck(): void {
    this._isSelected = false;
  }

  constructor(private dropdownService: CustomSelectService) {
    this.select = this.dropdownService.getSelect();
  }

  @HostListener('click', ['$event'])
  public onClick(event: UIEvent): void {
    event.preventDefault();
    this.select.selectOption(this);
  }

  public getOptionElement(): any {
    return this.option.nativeElement;
  }
}
