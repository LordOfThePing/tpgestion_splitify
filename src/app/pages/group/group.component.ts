import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { GroupMemberService } from '../../services/groupMembers.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from '../../../classes/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    FormsModule,
    NgIf

  ],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  public userGroups: Array<Group> = [];
  public userGroupsIsAdmin: Array<boolean> = [];
  private id_group: number = -1;
  public group: Group = new Group();
  public membersData: User[] = [];
  public members: Array<any> = [];

  constructor(
    private userService: UserService,
    private groupService: GroupService, 
    private groupMemberService: GroupMemberService, 
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const href = window.location.href;
      this.id_group = Number(href.split("/").pop()!);
      console.log("group id: ", this.id_group);
    });

    // Get group data
    try {
      const groupData = await lastValueFrom(this.groupService.getGroupById(this.id_group));
      this.group = groupData!;
    } catch (error) {
      // TODO: handle error
      console.log("group not found");
      this.router.navigateByUrl('/home');
    }

    // Get members data
    try {
      const members = await lastValueFrom(this.groupMemberService.getGroupMembers(this.id_group))
      this.members = members!;
      for (const member of this.members) {
        const userDataArray: any = await lastValueFrom(this.userService.getUserById(member.id_user));
        if (userDataArray) {
          const userData = userDataArray[0]; // Extract the user from the array
          this.membersData.push(userData!);
        }
      }
    } catch (error) {
      // TODO: handle error
      console.log("members not found");
      this.router.navigateByUrl('/home');
    }

  }

  async createCategory(formData: any): Promise<void> {
    let total_percentage = 0;
    
    if (formData.newCategoryName === "") {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }

    for (const key in formData) {
      if (key.startsWith("percentage")) {
        total_percentage += Number(formData[key]);
      }
    }
    if (total_percentage !== 100) {
      alert("El porcentaje total debe ser 100%");
      return;
    }

    console.log("total percentage: ", total_percentage);
    console.log("create category: ", formData);
    alert("TODO: create category");
  }
}