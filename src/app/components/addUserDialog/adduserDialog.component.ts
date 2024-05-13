import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../../classes/user';
import { lastValueFrom } from 'rxjs';
export interface AddUserDialogData {
  title: string;
  content: string;
  value: string;
  showError: boolean;
  msgError: string;  
}
@Component({
  selector: 'addUserDialog.component',
  templateUrl: 'addUserDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class AddUserDialogComponent {
  
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddUserDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      if (!this.data.value){
        this.data.showError = true;
        this.data.msgError = "Must insert an username";
        return; 
      }
      let userFound = await lastValueFrom(this.userService.getUser(this.data.value)) as User;
      if (!userFound) {
        this.data.showError = true;
        this.data.msgError = "Username not found";
        return; 
      }
      this.dialogRef.close(""+userFound.id_user);
    }
}
