import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { GroupMemberService } from '../../services/groupMembers.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from '../../../classes/user';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { CategoryShareService } from '../../services/categoryShare.service';
import { Category } from '../../../classes/category';
import { CategoryShare } from '../../../classes/categoryShare';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { GroupMember } from '../../../classes/groupMember';
import { SnackbarService } from '../../services/snackbar.service';
import { AddUserDialogComponent } from '../../components/addUserDialog/adduserDialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgClass,
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
  public admin_id: number = -1;
  public group: Group = new Group();
  public membersData: User[] = [];
  public members: Array<GroupMember> = [];
  public categories: Array<any> = [];

  constructor(
    private userService: UserService,
    private groupService: GroupService, 
    private groupMemberService: GroupMemberService,
    private categoryService: CategoryService,
    private snackBarService: SnackbarService, 
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { }

  async getGroupData(): Promise<void> {
    try {
      const groupData = await lastValueFrom(this.groupService.getGroupById(this.id_group));
      this.group = groupData!;
    } catch (error) {
      // TODO: handle error
      this.router.navigateByUrl('/home');
    }
  }

  async getMembersData(): Promise<void> {
    // Get members data
    try {
      const members = await lastValueFrom(this.groupMemberService.getGroupMembers(this.id_group)) as [GroupMember]
      this.members = members!;
      this.membersData = new Array;
      for (const member of this.members) {
        const userDataArray: Array<User> = await lastValueFrom(this.userService.getUserById(member.id_user)) as Array<User>;
        if (userDataArray) {
          if (member.is_admin) {
            this.admin_id = member.id_user;
          }
          this.membersData.push(userDataArray[0]);
        }
      }
    } catch (error) {
      // TODO: handle error
      alert("members not found");
    }
  }

  async getCategoriesData(): Promise<void> {
      // Get categories data
      try {
        const categories = await lastValueFrom(this.categoryService.getGroupCategories(this.id_group));
        this.categories = categories!;
      } catch (error) {
        // TODO: handle error
        alert("categories not found");
      }
    }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const href = window.location.href;
      this.id_group = Number(href.split("/").pop()!);
    });

    await this.getGroupData();
    await this.getMembersData();
    await this.getCategoriesData();

  }

  // Este método esta sobrecargadisimo
  // Tiene que pegarle al backend para crear una Category
  // Y despues multiples veces para crear los CategoryShares de esa Category
  // No es atomico!
  // TODO: CHEQUEAR QUE LOS NOMBRES DE LAS CATEGORIAS NO SE REPITAN
  async createCategory(formData: any): Promise<void> {
    let total_percentage = 0;
    
    // Obtengo datos para las categoryShares
    const newCategoryName = formData.newCategoryName;
    if (newCategoryName === "") {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }
    
    let newCategoryShares: CategoryShare[] = [];
    for (const key in formData) {
      if (!key.startsWith("percentage")) {
        continue;
      }
      const id_user = Number(key.replace("percentage", ""));
      
      let categoryShare = new CategoryShare();
      categoryShare.id_cs = 0; // para que se usa este campo?
      categoryShare.id_group = this.id_group;
      categoryShare.id_user = id_user;
      categoryShare.category_name = newCategoryName;
      categoryShare.share_percentage = Number(formData[key]);
      total_percentage += categoryShare.share_percentage;
      newCategoryShares.push(categoryShare);
    }

    if (total_percentage !== 100) {
      alert("El porcentaje total debe ser 100%");
      return;
    }

    // Creo la Category
    const newCategory = new Category();
    newCategory.name = newCategoryName;
    newCategory.description = "";
    newCategory.id_group = this.id_group;
    await lastValueFrom(this.categoryService.createCategory(newCategory)) as Category;

    // Creo los CategoryShares
    // TODO

    // Refresco la lista de categorias
    await this.getCategoriesData();
  }

  async deleteCategory(category: Category): Promise<void> {
    await lastValueFrom(this.categoryService.deleteCategory(category));
    await this.getCategoriesData();
  }

  async addUser() : Promise<void> {
    let dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '250px',
      data: {title: "Add user to group", content: "Insert the username to add", showError: false, msgError:""}
    });
    let user_id = await lastValueFrom(dialogRef.afterClosed());

    const newGroupMember = new GroupMember;
    newGroupMember.id_user = +user_id; 
    newGroupMember.id_group = this.id_group; 
    for (const member of this.members) {
      if (member.id_user == newGroupMember.id_user){
          this.snackBarService.open('Username already in group', 'info');
          return; 
        }
    }
    const groupMember = await lastValueFrom(this.groupMemberService.postGroupMember(newGroupMember)) as GroupMember;
    if (!groupMember) {
      this.snackBarService.open('Could not add user to group', 'error');
    } 
    this.snackBarService.open('Added user to group', 'success');
    await this.getGroupData();
    await this.getMembersData();
    await this.getCategoriesData();
  }

  async deleteUser(index:number): Promise<void> {

    let groupMemberDeleteArray = await lastValueFrom(this.groupMemberService.getUserIdGroupIdGroupMembers(this.membersData[index].id_user, this.id_group)) as [GroupMember];
    console.log(groupMemberDeleteArray[0]);
    let groupMemberDelete = await lastValueFrom(this.groupMemberService.deleteGroupMember(groupMemberDeleteArray[0])) as GroupMember;
    console.log(groupMemberDelete);
    this.snackBarService.open('User deleted', 'success');
    await this.getGroupData();
    await this.getMembersData();
    await this.getCategoriesData();
  }
}