import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { environment } from '../../../environments/environment';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public userGroups: Array<Group> = [];
  public groupName: string = "";

  constructor(private groupService: GroupService) { }

  async ngOnInit(): Promise<void> {
    this.userGroups = await lastValueFrom(this.groupService.getGroups()) as Array<Group>;
    console.log("User groups: ", this.userGroups);

  }

  async createGroup(): Promise<void> {
    console.log("create group")

    const group = new Group();
    group.name = this.groupName; 
    const groupCreated = await lastValueFrom(this.groupService.postGroup(group)) as Group;

    console.log("Group created: " + groupCreated);
    this.groupName = ''; // Clear the input field

    // Refresh the user groups
    this.userGroups = await lastValueFrom(this.groupService.getGroups()) as Array<Group>;
    console.log("User groups: ", this.userGroups);
  }

  editGroup(): void {
    console.log("edit group")
  }

  deleteGroup(): void {
    console.log("delete group")
  }
}