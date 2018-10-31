import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  credentialsTfs: any;
  credentialsVsts: any;

  serversFormGroup: FormGroup;

  urlOrigem: FormControl = new FormControl('', Validators.required);
  usuarioOrigem: FormControl = new FormControl('', Validators.required);
  senhaOrigem: FormControl = new FormControl('', Validators.required);
  dominioOrigem: FormControl = new FormControl('', Validators.required);
  workstationOrigem: FormControl = new FormControl('', Validators.required);
  urlDestino: FormControl = new FormControl('', Validators.required);
  tokenDestino: FormControl = new FormControl('', Validators.required);

  constructor(
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.serversFormGroup = this._formBuilder.group({
      urlOrigem: this.urlOrigem,
      usuarioOrigem: this.usuarioOrigem,
      senhaOrigem: this.senhaOrigem,
      dominioOrigem: this.dominioOrigem,
      workstationOrigem: this.workstationOrigem,
      urlDestino: this.urlDestino,
      tokenDestino: this.tokenDestino
    });
  }
}
