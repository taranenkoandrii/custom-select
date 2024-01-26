import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { noop } from 'rxjs';

import { CustomSelectOptionComponent } from './custom-select-option.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CustomSelectService } from './custom-select.service';

export interface CustomSelectEvent {
  source: CustomSelectComponent;
  selected: any;
}

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: CustomSelectComponent,
    },
    CustomSelectService,
  ],
})
export class CustomSelectComponent
  implements ControlValueAccessor, Validator
{
  @Input('id') public inputId: string = '';

  @Input() public label: string = '';

  @Input('aria-label') public ariaLabel = '';
  @Input('aria-labelledby') public ariaLabelledby = '';

  @Output() readonly change = new EventEmitter<CustomSelectEvent>();

  @ViewChild('select') public select!: ElementRef;
  @ViewChild(CdkPortal) public contentTemplate!: CdkPortal;

  @ContentChildren(CustomSelectOptionComponent)
  public options!: QueryList<CustomSelectOptionComponent>;

  public displayText!: SafeHtml;
  public displayX: boolean = false;

  private selectedOption: CustomSelectOptionComponent | undefined;
  private tempOption: CustomSelectOptionComponent | undefined;
  showing: boolean = false;
  private showPlaceholder: boolean = true;
  private overlayRef!: OverlayRef;

  constructor(
    private cd: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private overlay: Overlay,
    private selectService: CustomSelectService
  ) {
    this.selectService.register(this);
  }

  public onChangeFn: any = (_: any) => noop();

  public onTouchedFn: any = () => noop();

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  public writeValue(obj: any): void {}

  public onTouched(): void {
    this.onTouchedFn();
  }

  private onChange(): void {
    this.onChangeFn(this.selectedOption?.value);

    this.change.emit({
      source: this,
      selected: this.selectedOption,
    });
  }


  public onDropMenuIconClick(event: UIEvent): void {
    event.stopPropagation();
    this.select.nativeElement.focus();
    this.select.nativeElement.click();
  }

  public selectOption(option: CustomSelectOptionComponent) {
    this.tempOption?.unCheck();
    this.selectedOption?.unCheck();

    if (this.tempOption !== option) {
      this.tempOption = option;
      this.tempOption.check();
    } else {
      this.tempOption = undefined;
    }
  }

  private updateDisplayText(): void {
    if (this.selectedOption !== undefined) {
      this.displayText = this.domSanitizer.bypassSecurityTrustHtml(
        this.selectedOption.getOptionElement().innerHTML
      );
    }
  }

  public showDropdown(): void {
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    this.overlayRef.attach(this.contentTemplate);
    this.syncWidth();
    this.overlayRef.backdropClick().subscribe(() => this.cancel());
    this.showing = true;
  }

  submit(): void {
    this.selectedOption = this.tempOption;
    this.onChange();
    this.updateDisplayText();
    this.hide();
  }

  cancel(): void {
    this.tempOption?.unCheck();
    this.selectedOption?.check();

    this.tempOption = undefined;

    this.hide();
  }

  hide(): void {
    this.overlayRef.detach();
    this.showing = false;
  }

  get isSubmitEnabled(): boolean {
    return Boolean(this.tempOption);
  }

  private syncWidth(): void {
    if (!this.overlayRef) {
      return;
    }

    const refRectWidth =
      this.select.nativeElement.getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: refRectWidth });
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.select.nativeElement)
      .withPush(true)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }
}
