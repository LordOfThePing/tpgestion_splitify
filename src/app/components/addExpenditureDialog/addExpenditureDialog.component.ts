import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MatOptionModule } from '@angular/material/core';
import { Category } from '../../../classes/category';
export interface AddExpenditureDialogData {
  value: string; 
  amount: number;
  category: string; 
  description: string; 
  categories: Array<Category>;
  showAmountError: boolean;
  msgAmountError: string;  
  showCategorySelectError: boolean;
  msgCategorySelectError: string; 
  showDescriptionError: boolean;
  msgDescriptionError: string;  
  userIdRequestor: number;
}
@Component({
  selector: 'addExpenditureDialog.component',
  templateUrl: 'addExpenditureDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatOptionModule, MatSelectModule]
})
export class AddExpenditureDialogComponent {
  
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<AddExpenditureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddExpenditureDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      // TODO
      /* 
      if (!this.data.value){
        this.data.showError = true;
        this.data.msgError = "Must insert an username";
        return; 
      }
      let usersFound = await lastValueFrom(this.userService.getUserByUsername(this.data.value)) as User[];
      if (!usersFound || usersFound.length < 1) {
        this.data.showError = true;
        this.data.msgError = "Username not found";
        return; 
      }
      if (usersFound[0].id_user == this.data.userIdRequestor) {
        this.data.showError = true;
        this.data.msgError = "Cannot add yourself to the group";
        return; 
      }

      this.dialogRef.close(""+usersFound[0].id_user);
      */ 
      this.dialogRef.close(); 
    }
}
