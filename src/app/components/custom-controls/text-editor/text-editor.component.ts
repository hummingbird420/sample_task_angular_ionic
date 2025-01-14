import { Component, Input, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ], standalone: false
})
export class TextEditorComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() text: string = '';
  editor: any = ClassicEditor ?? {};
  description: string = '';
  onChange: any = () => { };
  onTouch: any = () => { };
  isDisabled: boolean = false;
  ckEditorInstance: any;
  editorConfig: any = {
    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
  };

  constructor() { }

  ngOnInit() {
    this.description = this.text ? this.text.trim() : '';
  }

  ngOnDestroy() {
    if (this.ckEditorInstance) {
      this.ckEditorInstance.destroy()
        .then(() => { })
        .catch((error: any) => { });
    }
  }


  writeValue(value: any): void {
    this.description = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }


  onDescriptionChange(event: any) {
    if (event && event.editor) {
      const editorInstance = event.editor;
      const htmlData = editorInstance.getData();
      this.onChange(htmlData);
      this.onTouch(htmlData);
    }
  }
}
