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
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
export interface ChangeGroupNameDialogData {
  title: string;
  content: string;
  value: string;
  showError: boolean;
  msgError: string;  
  groupToEdit: Group; 
  
}
@Component({
  selector: 'changeGroupNameDialog.component',
  templateUrl: 'changeGroupNameDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class ChangeGroupNameDialogComponent {
  
  constructor(
    private userService: UserService,
    private groupService: GroupService, 
    public dialogRef: MatDialogRef<ChangeGroupNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangeGroupNameDialogData) {}
    
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {
      if (!this.data.value){
        this.data.showError = true;
        this.data.msgError = "Must insert a group name";
        return; 
      }

      this.data.groupToEdit.name = this.data.value; 
      let updatedGroup = await lastValueFrom(this.groupService.putGroup(this.data.groupToEdit)) as Group;

      if (!updatedGroup) {
        this.data.showError = true;
        this.data.msgError = "Unknown error. Try again later";
        return; 
      }
      this.dialogRef.close(""+updatedGroup.id_group);
    }
}
