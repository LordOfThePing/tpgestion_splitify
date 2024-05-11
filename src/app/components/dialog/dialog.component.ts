import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
export interface DialogData {
  title: string;
  content: string;
  value: string;
}
@Component({
  selector: 'dialog.component',
  templateUrl: 'dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})

export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.data.value = ""; 
    this.dialogRef.close();
  }

}
