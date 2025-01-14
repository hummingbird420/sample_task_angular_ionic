import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';

import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormField, FormFieldModel } from 'src/app/models/form-field.model';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  standalone: false
})
export class FormFieldComponent implements OnInit, OnDestroy {

  dead$: Subject<void> = new Subject();
  @Input() formField!: FormFieldModel | BehaviorSubject<FormFieldModel>;
  formFieldRef!: FormFieldModel;
  dynamicForm!: FormGroup;
  @Output() oSubmit: EventEmitter<any> = new EventEmitter();
  @Output() oDraft: EventEmitter<any> = new EventEmitter();
  @Output() oRewind: EventEmitter<any> = new EventEmitter();
  @Output() oCancel: EventEmitter<any> = new EventEmitter();
  @Output() oReset: EventEmitter<any> = new EventEmitter();
  @Output() ddlChange: EventEmitter<any> = new EventEmitter();
  @Output() oRadioChange: EventEmitter<any> = new EventEmitter();

  reset: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isSubmitted: boolean = false;
  userId: string = '';

  constructor(private fb: FormBuilder) { }
  ngOnInit() {

    if (this.formField && this.formField instanceof BehaviorSubject) {
      this.formField.pipe(takeUntil(this.dead$)).subscribe((value: FormFieldModel) => {
        this.userId = value.fields.filter(((f: any) => f.type == "user"))[0]?.value ?? '';
        this.createFormGroup(value);
      });

    } else {
      this.userId = this.formField.fields.filter((f => f.type == "user"))[0]?.value ?? '';
      this.createFormGroup(this.formField);
    }
    Object.keys(this.dynamicForm.controls).forEach((controlName) => {
      const control = this.dynamicForm.get(controlName);

      if (control) {
        control.valueChanges.pipe(distinctUntilChanged()).subscribe((newValue) => {
          let selectList = this.formFieldRef.fields.filter((f => f.type == "select")).filter(ff => ff.name == controlName);

          if (selectList && selectList.length == 1) {
            this.ddlChange.emit({ 'name': controlName, 'value': newValue ?? '0' });
          }
        });
      }
    });

  }
  ngOnDestroy() {
    this.dead$.next();
    this.dead$.complete();
  }

  createFormGroup(field: FormFieldModel) {
    this.formFieldRef = field;
    const group: { [key: string]: any } = {};
    field.fields.forEach((formField: FormField) => {
      const validatorsArray = [];
      let isDisabled = false;
      if (formField.required) {
        validatorsArray.push(Validators.required);
      }
      if (formField.disable) {
        isDisabled = true;
      }
      group[formField.name] = [{ value: formField.value ?? '', disabled: isDisabled }, validatorsArray];
      if (formField.matchValidator) {
        group[formField.name][1].push(this.matchValidator(formField.matchValidator, formField.name));
      }
    });
    this.dynamicForm = this.fb.group(group);
  }
  onButtonClick(arg0: string) {
    this.reset.next(false);
    if (arg0 === 'submit') {

      if (this.dynamicForm.invalid) {
        this.isSubmitted = true;
        return;
      }
      const form = this.dynamicForm.getRawValue();

      this.oSubmit.emit(form);
    }
    if (arg0 === 'rewind') {

      if (this.dynamicForm.invalid) {
        this.isSubmitted = true;
        return;
      }
      const form = this.dynamicForm.getRawValue();
      this.oRewind.emit(form);
    }
    if (arg0 === 'draft') {

      //console.log(this.dynamicForm.getRawValue());

      if (this.dynamicForm.invalid) {
        this.isSubmitted = true;
        return;
      }
      const form = this.dynamicForm.getRawValue();

      this.oDraft.emit(form);
    }
    else if (arg0 === 'reset') {
      this.isSubmitted = false;
      this.reset.next(true);
      this.dynamicForm.reset();
      this.oReset.emit();
      this.ngOnInit();
    }
  }
  onChangeEvent(event: any, name: string, child: any, scaffold: string = "") {
    this.ddlChange.emit({ 'name': name, 'value': event?.target?.value });
    let serial = this.formFieldRef.fields.find((field: any) => field.name === name);
    const data = this.formFieldRef.fields.filter(f => f.serial > (serial?.serial ?? 0) && f.type == 'select' && (f.group ?? 0) == (serial?.group ?? 0));
    if (data && data.length > 0) {
      data.forEach((element: any) => {
        this.dynamicForm.controls[element.name].setValue('');
      });
    }
    if (child) {
      let previousValue = this.dynamicForm.controls[child].value || '';
      let previousVal = this.dynamicForm.controls['ReferenceValue'].value || '';
      let currentValue = event?.target?.value || '';
      let selectedText = (event.target as HTMLSelectElement).options[(event.target as HTMLSelectElement).selectedIndex].text || '';

      // Split the previous values into arrays
      let previousValueArray = previousValue.split(', ').filter((item: any) => item.trim() !== '');
      let previousValArray = previousVal.split(',').filter((item: any) => item.trim() !== '');

      // Check for duplicates before adding
      if (!previousValueArray.includes(selectedText)) {
        previousValueArray.push(selectedText);
      }
      if (!previousValArray.includes(currentValue)) {
        previousValArray.push(currentValue);
      }

      // Join the arrays back into strings
      selectedText = previousValueArray.join(', ');
      currentValue = previousValArray.join(',');

      this.dynamicForm.controls[name].setValue('');
      this.dynamicForm.controls[child].setValue(selectedText);
      this.dynamicForm.controls['ReferenceValue'].setValue(currentValue);

    }
    if (scaffold) {
      this.dynamicForm.controls[scaffold].setValue(event?.target?.selectedOptions[0]?.innerText);
    }
  }
  onRadioChange(event: any, name: string) {
    this.oRadioChange.emit({ 'name': name, 'value': event?.target?.value });
  }
  matchValidator(control1: string, control2: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value1 = this.dynamicForm?.controls[control1]?.value;
      const value2 = this.dynamicForm?.controls[control2]?.value;
      if (value1 && value2) {
        return value1 === value2 ? null : { 'mismatch': true };
      }
      return null;
    };
  }
  checkHide(arg: boolean | undefined | null): boolean {
    return arg === false || arg === null || arg === undefined;
  }
  clearInput(name: string) {
    this.dynamicForm.controls[name].setValue('');

  }
  checkWithValue(name: string) {
    return this.dynamicForm.controls[name].value;
  }

  getOptionValue(name: string, value: string, count: number, def: any, isNotSelected: boolean = false): string {

    if (count === 1 && !isNotSelected) {
      this.dynamicForm.controls[name].setValue(def);
    }
    return value;
  }
}
