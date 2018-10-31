import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  modalExclusao(mensagem: string) {
    return this.dialog.open(ModalSimNao, { data: { mensagem: mensagem } });
  }
  modalSucesso(mensagem: string) {
    return this.dialog.open(ModalSuccess, { data: { mensagem: mensagem } });
  }
  modalErro(mensagem: string) {
    return this.dialog.open(ModalError, { data: { mensagem: mensagem } });
  }
}

@Component({
  selector: 'modal-success',
  templateUrl: 'success.html',
  styleUrls: ['./modal.component.css']
})
export class ModalSuccess {

  public mensagem: string;

  constructor(public dialogRef: MatDialogRef<ModalSuccess>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mensagem = data.mensagem;
  }

  okClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'modal-error',
  templateUrl: 'error.html',
  styleUrls: ['./modal.component.css']
})
export class ModalError {

  public mensagem: string;

  constructor(public dialogRef: MatDialogRef<ModalError>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mensagem = data.mensagem;
  }

  okClick() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'modal-simnao',
  templateUrl: 'simnao.html',
  styleUrls: ['./modal.component.css']
})
export class ModalSimNao {

  public mensagem: string;

  constructor(public dialogRef: MatDialogRef<ModalSimNao>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.mensagem = data.mensagem;
  }

  simClick() {
    this.dialogRef.close({ selected: true });
  }

  naoClick() {
    this.dialogRef.close({ selected: false });
  }

}
