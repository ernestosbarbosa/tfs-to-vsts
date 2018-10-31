import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {

  @ViewChild(MatPaginator) plansPaginator: MatPaginator;
  @ViewChild(MatSort) plansSort: MatSort;

  plans: any;
  plansDest: any;
  plansDisplayedColumns: string[] = ['select', 'id', 'name', 'iteration', 'state'];
  plansDataSource: MatTableDataSource<any> = new MatTableDataSource();
  plansSelection = new SelectionModel<any>(true, []);
  isPlanHeaderDisabled: boolean = false;

  plansFormGroup: FormGroup;
  planoDestino: FormControl = new FormControl('', Validators.required);

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.plansFormGroup = this._formBuilder.group({
      planoDestino: this.planoDestino
    });
  }

  applyFilterPlans(filterValue: string) {
    this.plansDataSource.filter = filterValue.trim().toLowerCase();

    if (this.plansDataSource.paginator) {
      this.plansDataSource.paginator.firstPage();
    }
  }

  isAllSelectedPlans() {
    const numSelected = this.plansSelection.selected.length;
    const numRows = this.plansDataSource.data.length;
    return numSelected === numRows;
  }

  masterTogglePlans() {
    this.isAllSelectedPlans() ?
      this.plansSelection.clear() :
      this.plansDataSource.data.forEach(row => this.plansSelection.select(row));
  }

  isPlansHeaderDisabled() {
    return this.isPlanHeaderDisabled;
  }
  
  disableAllPlans() {
    this.plansDataSource.data.forEach(row => { row.disable = true });
    this.plans.forEach(row => { row.disabled = true; });
    this.isPlanHeaderDisabled = true;
  }

}
