import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';

import { DatePipe } from '@angular/common';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


interface BoolKeys {
  [key: string]: boolean;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})


export class FileUploadComponent implements ControlValueAccessor, OnInit, OnDestroy {
  dead$ = new Subject();
  @Input() icon: string = '';
  @Input() userId: string = '';
  @Input() reset: BehaviorSubject<boolean> = new BehaviorSubject(false);
  @Input() name: string = '';
  photoPath: string = '';
  text: any;
  dataUrl: string = '';
  onChange: any = () => { };
  onTouch: any = () => { };
  isDisabled: boolean = false;
  returnFile: File | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('modal') fileModal!: IonModal;

  isModalOpen: boolean = false;
  modalName: string = '';
  isModalFlag: boolean = false;

  constructor(private modalCtrl: ModalController, private datePape: DatePipe) { }
  ngOnDestroy(): void {
    this.dead$.next('');
    this.dead$.complete();
  }
  ngOnInit(): void {
    this.reset.pipe(takeUntil(this.dead$)).subscribe((value) => {
      if (value) {
        this.dataUrl = '';
        this.returnFile = null;
        this.createOnChenge();
      }
    });

  }
  writeValue(value: any): void {
    if (value) {
      this.dataUrl = value;

    }

    // this.dataUrl = value;
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

  onFileSelected(event: any) {

    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.returnFile = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.dataUrl = reader.result as string;
      };
      this.createOnChenge();
    }
  }
  toggleFileInput() {
    const fileInputElement: HTMLInputElement = this.fileInput.nativeElement;
    fileInputElement.click();
  }
  async capturePhoto() {

    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    this.photoPath = image.webPath!;
    this.dataUrl = this.photoPath;
    let name = 'captured_' + this.datePape.transform(new Date(), 'dd_MM_yy_hh_mm_ss') + '.jpg';
    this.blobUrlToFile(this.photoPath, name).then((data) => {
      this.returnFile = data;
      this.createOnChenge();
    }).catch((err) => { this.createOnChenge(); });


  }
  createOnChenge() {
    this.onChange(this.returnFile);
    this.onTouch(this.returnFile);
    this.onModalDismiss('', this.name);
    if (this.fileModal) {
      this.fileModal.dismiss();
    }


  }

  closeImg() {
    this.dataUrl = '';
    this.returnFile = null;
    this.createOnChenge();
  }
  async blobUrlToFile(blobUrl: string, fileName: string): Promise<File | null> {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: blob.type });
      return file;
    } catch (error) {
      console.error('Error converting Blob URL to file:', error);
      return null;
    }
  }
  async base64ToFile(base64String: string, fileName: string): Promise<File> {
    let arr = base64String.split(',');
    let mime = '';

    if (arr && arr.length && arr[0]) {
      const match = arr[0].match(/:(.*?);/);
      if (match && match.length >= 2) {
        mime = match[1];
      }
    }

    const bstr = atob(arr[arr.length - 1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  setOpen(isOpen: boolean, name: string) {
    this.isModalOpen = this.isModalFlag;
    this.modalName = name;
  }
  onModalDismiss(event: any, name: string) {

    this.isModalOpen = this.isModalFlag;
  }
}
