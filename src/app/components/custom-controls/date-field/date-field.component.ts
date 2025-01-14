import { ChangeDetectorRef, Component, Input, ViewChild, forwardRef } from '@angular/core';
import { IonAccordionGroup, IonDatetime } from '@ionic/angular';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-field',
  templateUrl: './date-field.component.html',
  styleUrls: ['./date-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateFieldComponent),
      multi: true,
    },
  ],
})
export class DateFieldComponent implements ControlValueAccessor {
  @ViewChild('date_field', { static: false }) date_field!: IonAccordionGroup;
  @ViewChild('datetime', { static: false }) datetime!: IonDatetime;

  @Input() min: any = undefined;
  @Input() max: any = undefined;
  @Input() name: string = '';
  @Input() isDisabled: boolean = false;

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  dateField: any;

  constructor(private cdr: ChangeDetectorRef, private datePipe: DatePipe) {

  }

  toggleAccordion = () => {
    this.datetime.confirm().then(() => {
      this.onChange(this.dateField);
      this.onTouched();
      this.cdr.detectChanges();
    });
    const nativeEl = this.date_field;
    if (nativeEl.value === 's_date') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 's_date';
    }

  };
  updateMinDate() {
    const daysToAdd = Number(this.min ?? 0);
    const newMinDate = this.addDays(new Date(), daysToAdd);
    return this.datePipe.transform(newMinDate, 'yyyy-MM-dd');
  }
  updateMaxDate() {
    const daysToAdd = Number(this.max ?? 0);
    const newMaxDate = this.addDays(new Date(), daysToAdd);
    return this.datePipe.transform(newMaxDate, 'yyyy-MM-dd');
  }
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  dateReset() {
    this.datetime.reset();
    this.dateField = null;
    this.onChange(this.dateField);
    this.toggleAccordion();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.dateField = value ?? String(new Date().toISOString().substring(0, 10));
    if (this.datetime) {
      this.datetime.value = this.dateField;
      this.cdr.detectChanges();
    }


  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state
  }
}
