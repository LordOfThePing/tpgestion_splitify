import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { GroupMemberService } from '../../services/groupMembers.service';
import { GroupMember } from '../../../classes/groupMember';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf

  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userGroups: Array<Group> = [];
  public userGroupsIsAdmin: Array<boolean> = [];
  public groupName: string = "";

  constructor(private groupService: GroupService, private authService: AuthService, private groupMemberService: GroupMemberService) { }

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
    console.log("posting group: " + group);
    // Creo un nuevo grupo
    const groupCreated = await lastValueFrom(this.groupService.postGroup(group)) as Group;
    const groupMember = new GroupMember();
    groupMember.id_group = groupCreated.id_group; 
    groupMember.id_user = this.authService.loggedUserId(); 
    groupMember.is_admin = true;
    console.log("posting group member id_group: " + groupMember.id_group);
    console.log("posting group member id_user: " + groupMember.id_user);
    console.log("posting group member is_admin: " + groupMember.is_admin);
    // Creo una nueva relacion groupMember para ese grupo
    const groupMemberCreated = await lastValueFrom(this.groupMemberService.postGroupMember(groupMember)) as GroupMember;
    return groupCreated; 
    
  }

  editGroup(): void {
    console.log("edit group")
  }

  deleteGroup(): void {
    console.log("delete group")
  }
}