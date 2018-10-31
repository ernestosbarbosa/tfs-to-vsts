import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {

  @ViewChild(MatPaginator) testsPaginator: MatPaginator;
  @ViewChild(MatSort) testsSort: MatSort;

  tests: any;
  testsDisplayedColumns: string[] = ['select', 'id', 'name', 'suite', 'plan', 'state'];
  testsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  testsSelection = new SelectionModel<any>(true, []);
  isTestHeaderDisabled: boolean = false;

  constructor() { }

  ngOnInit() {
    this.testsDataSource.filterPredicate = (data, filter)=>{
      return data.wit.fields["System.Title"].toLowerCase().includes(filter) ||
      data.testCase.id.toLowerCase().includes(filter) ||
      data.plan.fields["System.Title"].toLowerCase().includes(filter) ||
      data.suite.fields["System.Title"].toLowerCase().includes(filter);
    };
  }

  applyFilterTests(filterValue: string) {
    this.testsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.testsDataSource.paginator) {
      this.testsDataSource.paginator.firstPage();
    }
  }

  isAllSelectedTests() {
    const numSelected = this.testsSelection.selected.length;
    const numRows = this.testsDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggleTests() {
    this.isAllSelectedTests() ?
      this.testsSelection.clear() :
      this.testsDataSource.data.forEach(row => this.testsSelection.select(row));
  }

  isTestsHeaderDisabled() {
    return this.isTestHeaderDisabled;
  }

  disableAllTests() {
    this.testsDataSource.data.forEach(row => { row.disable = true });
    this.tests.forEach(row => { row.disabled = true; });
    this.isTestHeaderDisabled = true;
  }

}
