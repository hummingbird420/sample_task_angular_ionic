import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { AccessDeniedComponent } from "./access-denied/access-denied.component";
import { CommonModule } from "@angular/common";
import { ConfirmClickComponent } from "./confirm-click/confirm-click.component";
import { AppTableComponent } from "./app-table/app-table.component";
import { SanitizePipe } from "../pipes/sanitize.pipe";
import { FormFieldComponent } from "./form-field/form-field.component";
import { TextEditorComponent } from "./custom-controls/text-editor/text-editor.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";

@NgModule({
    declarations: [
        AccessDeniedComponent,
        ConfirmClickComponent,
        AppTableComponent,
        FormFieldComponent,
        TextEditorComponent,
        FileUploadComponent
    ],
    imports: [IonicModule, CommonModule, SanitizePipe],
    providers: [SanitizePipe],
    exports: [
        AccessDeniedComponent,
        ConfirmClickComponent,
        AppTableComponent,
        FormFieldComponent,
        FileUploadComponent
    ]
})
export class ComponentsModule { }
