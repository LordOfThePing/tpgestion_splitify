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
export interface DeleteMemberDialogData {
  title: string;
  content: string;
  value: string;
  showError: boolean;
  msgError: string;  
}
@Component({
  selector: 'deleteMemberDialog.component',
  templateUrl: 'deleteMemberDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class DeleteMemberDialogComponent {
  
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<DeleteMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteMemberDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {

      this.dialogRef.close("deleted");
    }
}
