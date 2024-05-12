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
import { SnackbarService } from '../../services/dialog.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

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
  public groupName: string = "";
  public newCategoryName: string = "";
  private id_group: number = -1;

  constructor(
    private groupService: GroupService, 
    private authService: AuthService, 
    private groupMemberService: GroupMemberService, 
    private snackBarService: SnackbarService, 
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const href = window.location.href;
      this.id_group = Number(href.split("/").pop()!);
      console.log("group id: ", this.id_group);
    });

    try {
      const groupData = await lastValueFrom(this.groupService.getGroupById(this.id_group));
      console.log("group data: ", groupData)
      this.groupName = groupData!.name;
    } catch (error) {
      // TODO: redirect to home page
      console.log("group not found");
      this.router.navigateByUrl('/home');
    }
  }

  async createCategory(): Promise<void> {
    console.log("create category")
  }
}