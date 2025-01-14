import { Observable, of } from 'rxjs';
export interface FormFieldModel {

    label: string;
    hint: string;
    icon: string;
    buttons: Button[];
    fields: FormField[];
}
export interface Button {
    label: string;
    icon: string;
    type: string;
}
export interface Option {
    label: string;
    value: string;

}
export class FormField {
    serial: number;
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    value?: string;
    matchValidator?: string;
    required?: boolean;
    icon?: string;
    disable?: boolean;
    options?: Observable<Option[]>;
    hide?: Observable<boolean>;
    group?: number;
    refChild?: string;
    maxDay?: number;
    minDay?: number;
    scaffold?: string;
    isAutoSelectStop?: boolean;
    constructor(
        serial: number,
        label: string = '',
        name: string,
        type: string,
        placeholder: string = '',
        value: string = '',
        matchValidator: string = '',
        required: boolean = false,
        icon: string = '',
        disable: boolean = false,
        options: Observable<Option[]> = new Observable<[]>,
        hide = of(false),
        isAutoSelectStop: boolean = false,
    ) {
        this.serial = serial;
        this.label = label;
        this.name = name;
        this.type = type;
        this.placeholder = placeholder;
        this.value = value;
        this.matchValidator = matchValidator;
        this.required = required;
        this.icon = icon;
        this.disable = disable;
        this.options = options;
        this.hide = hide;
        this.isAutoSelectStop = isAutoSelectStop;
    }
}