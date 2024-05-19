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
import { Category } from '../../../classes/category';
import { CategoryShare } from '../../../classes/categoryShare';
export interface ListSharesDialogData {
  title: string;
  category: Category;
  category_shares: Array<CategoryShare>;
  usernames: Array<String>; 
  value: string;
  showError: boolean;
  msgError: string;  
}
@Component({
  selector: 'listSharesDialog.component',
  templateUrl: 'listSharesDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule]
})
export class ListSharesDialogComponent implements OnInit{
  
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ListSharesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListSharesDialogData) {}

    async ngOnInit(): Promise<void> {
      this.data.usernames = new Array; 
      for(const cs of this.data.category_shares){
        this.data.usernames.push((await lastValueFrom(this.userService.getUser(cs.id_user)) as User).username); 
      }

      console.log(this.data.usernames);
    }
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {

      this.dialogRef.close();
    }

}
