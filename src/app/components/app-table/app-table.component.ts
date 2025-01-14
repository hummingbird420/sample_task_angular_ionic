import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TableData } from 'src/app/models/table-header.model';

@Component({
  selector: 'app-app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss'],
  standalone: false
})
export class AppTableComponent implements OnInit, OnDestroy {
  dead$ = new Subject();
  @Input() table!: any[] | Observable<any[]>;
  tableData: any[] = [];
  @Input() tableDataKey: TableData[] = [];




  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() callBackFunc: EventEmitter<any> = new EventEmitter();
  @Output() editAction: EventEmitter<any> = new EventEmitter();


  constructor(private cdRef: ChangeDetectorRef) { }
  ngOnDestroy(): void {
    this.tableData = [];
    this.dead$.next('');
    this.dead$.unsubscribe();
  }
  ngOnInit() {
    if (this.table instanceof Observable) {
      this.table.subscribe(data => {
        this.tableData = data;
        this.cdRef.detectChanges();
      });
    } else {
      this.tableData = this.table;
      this.cdRef.detectChanges();
    }
  }
  hasButtonType(): boolean {
    return this.tableDataKey.some((key: TableData) => key.buttonType && key.buttonType.length > 0);
  }
  pageChanged(page: any) {
    //do as your requirements here
    this.pageChange.emit(page);
  }
  callBack(event: any, key: string) {
    this.callBackFunc.emit({ event: event, key: key });
  }
  onEditData(id: any) {
    this.editAction.emit(id);
  }

}