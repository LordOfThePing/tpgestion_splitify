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
  public group: Group = new Group();
  private id_group: number = -1;

  constructor(
    private groupService: GroupService, 
    private authService: AuthService, 
    private groupMemberService: GroupMemberService, 
    private snackBarService: SnackbarService, 
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

    try {
      const groupData = await lastValueFrom(this.groupService.getGroupById(this.id_group));
      console.log("group data: ", groupData)
      this.group = groupData!;
    } catch (error) {
      console.log("group not found");
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