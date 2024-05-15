import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { GroupMemberService } from '../../services/groupMembers.service';
import { GroupMember } from '../../../classes/groupMember';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangeGroupNameDialogComponent } from '../../components/changeGroupNameDialog/changeGroupNameDialog.component';
import { NewGroupDialogComponent } from '../../components/newGroupDialog/newGroupDialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf,
    RouterLink, 
    MatInputModule, 
    MatFormFieldModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userGroups: Array<Group> = [];
  public userGroupsIsAdmin: Array<boolean> = [];
  public groupName: string = "";

  constructor(
    private groupService: GroupService, 
    private authService: AuthService, 
    private groupMemberService: GroupMemberService, 
    private snackBarService: SnackbarService, 
    public dialog: MatDialog, 
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.refreshGroups();

    console.log("User groups: ", this.userGroups);

  }


  async refreshGroups() {
    this.userGroups = [];

    // Obtengo todos los group_id a los que pertenece el user_id logueado 
    let userGroupMembers = await lastValueFrom(this.groupMemberService.getUserIdGroupMembers(this.authService.loggedUserId())) as Array<GroupMember>;
    if (!userGroupMembers){
      return;
    }
    // busco los groups de los group_id encontrados
    for (let index = 0; index < userGroupMembers.length; index++) {
      this.userGroups.push(await lastValueFrom(this.groupService.getGroupById(userGroupMembers[index].id_group)) as Group);
      this.userGroupsIsAdmin.push(userGroupMembers[index].is_admin);
    }
  }

  async createGroup() {
    console.log("create group")

    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      width: '250px',
      data: {title: "New Group", content: "Insert the new group name", id_user_logged: this.authService.loggedUserId()}
    });
    const groupCreatedName = await lastValueFrom(dialogRef.afterClosed());
    if (groupCreatedName){
      this.snackBarService.open('Group \"' + groupCreatedName + '\" created', 'success');
    }
    await this.refreshGroups();
  }

  async enterGroup(index:number): Promise<void> {
    if (this.authService.isAuth()) {
      this.router.navigate(['/group/' + this.userGroups[index].id_group]);
    }


  }

  deleteGroup(): void {
    console.log("delete group")
  }
}