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
import { DialogComponent } from '../../components/dialog/dialog.component';
import { SnackbarService } from '../../services/snackbar.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf,
    RouterLink
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

  async createGroup(): Promise<void> {
    console.log("create group")

    const groupCreated = await this.createGroupAndGroupMember(); 
    console.log("Group created: " + groupCreated);
    this.groupName = ''; // Clear the input field
    this.refreshGroups();
    this.snackBarService.open('Group \"' + groupCreated.name + '\" created', 'success');

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

  async createGroupAndGroupMember() : Promise<Group> {
    const group = new Group();
    group.name = this.groupName; 
    // Creo un nuevo grupo
    const groupCreated = await lastValueFrom(this.groupService.postGroup(group)) as Group;
    const groupMember = new GroupMember();
    groupMember.id_group = groupCreated.id_group; 
    groupMember.id_user = this.authService.loggedUserId(); 
    groupMember.is_admin = true;

    // Creo una nueva relacion groupMember para ese grupo
    const groupMemberCreated = await lastValueFrom(this.groupMemberService.postGroupMember(groupMember)) as GroupMember;
  
    return groupCreated; 
    
  }

  async editGroupName(index:number): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {title: "Edit Group name", content: "Insert the new group name"}
    });
    let newName = await lastValueFrom(dialogRef.afterClosed());
    if (newName){
      const group = new Group();
      group.id_group = this.userGroups[index].id_group; 
      group.members_count = this.userGroups[index].members_count; 
      group.time_created = this.userGroups[index].time_created; 
      group.name = newName; 
      let updatedGroup = await lastValueFrom(this.groupService.putGroup(group)) as Group;
      this.snackBarService.open('Group name updated', 'success');
      this.refreshGroups();
    }

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