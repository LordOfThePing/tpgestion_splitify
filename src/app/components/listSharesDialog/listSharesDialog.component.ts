import { Component, Inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource  } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../../classes/user';
import { lastValueFrom, share } from 'rxjs';
import { Category } from '../../../classes/category';
import { CategoryShare } from '../../../classes/categoryShare';
export interface ListSharesDialogData {
  title: string;
  category: Category;
  category_shares: Array<CategoryShare>;
  value: string;
  showError: boolean;
  msgError: string;  
}

export interface ShareTableElement {
  username: string;
  sharePercentage: string;
}
@Component({
  selector: 'listSharesDialog.component',
  templateUrl: 'listSharesDialog.component.html',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule]
})
export class ListSharesDialogComponent implements OnInit{
  public displayedColumns: string[] = ['username', 'sharePercentage'];
  public dataSource = new MatTableDataSource<ShareTableElement>([]);
  
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ListSharesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListSharesDialogData) {}
    
    async ngOnInit(): Promise<void> {

      let arr = new Array; 
      for (const cs of this.data.category_shares) {
        let shareTableElement: ShareTableElement = {username: "", sharePercentage: ""}; 
        shareTableElement.username = (await lastValueFrom(this.userService.getUser(cs.id_user)) as User).username;
        shareTableElement.sharePercentage = cs.share_percentage + "%"; 
        arr.push(shareTableElement); 

      }
      this.dataSource.data = arr; 
    }
    onNoClick(): void {
      this.data.value = ""; 
      this.dialogRef.close();
    }
    async onClick(): Promise<void> {

      this.dialogRef.close();
    }

}
