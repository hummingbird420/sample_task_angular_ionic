import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizer) { }

    transform(value: string): SafeHtml {
        // Bypass Angular's security for trusted HTML
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
