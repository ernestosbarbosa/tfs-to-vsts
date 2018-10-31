import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: any;
  projectsDest: any;
  projectsFormGroup: FormGroup;
  projetoOrigem: FormControl = new FormControl('', Validators.required);
  projetoDestino: FormControl = new FormControl('', Validators.required);

  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  modal: ModalComponent = new ModalComponent(this.dialog);

  ngOnInit() {
    this.projectsFormGroup = this._formBuilder.group({
      projetoOrigem: this.projetoOrigem,
      projetoDestino: this.projetoDestino
    });
  }

}
