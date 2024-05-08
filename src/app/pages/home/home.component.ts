import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  public userGroups: any;
  public groupName: string = "";
  private apiUrl = 'http://localhost:8000'; // URL de tu backend FastAPI

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(`${this.apiUrl}/user_groups`).subscribe(data => {
      this.userGroups = data;
      console.log("User groups: ", this.userGroups);
    });
  }

  createGroup(): void {
    console.log("create group")
    const groupData = {
      name: this.groupName
    };

    this.http.post(`${this.apiUrl}/user_groups`, groupData).subscribe(response => {
      console.log(response);
      this.groupName = ''; // Clear the input field

      // Refresh the user groups
      this.http.get(`${this.apiUrl}/user_groups`).subscribe(data => {
        this.userGroups = data;
        console.log("User groups: ", this.userGroups);
      });
    });
  }

  editGroup(): void {
    console.log("edit group")
  }

  deleteGroup(): void {
    console.log("delete group")
  }
}