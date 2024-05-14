import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../classes/group';
import { GroupService } from '../../services/group.service';
import { lastValueFrom } from 'rxjs';
import { GroupMemberService } from '../../services/groupMembers.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { User } from '../../../classes/user';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../classes/category';
import { CategoryShare } from '../../../classes/categoryShare';
import { GroupMember } from '../../../classes/groupMember';
import { SnackbarService } from '../../services/snackbar.service';
import { AddUserDialogComponent } from '../../components/addUserDialog/adduserDialog.component';
import { CategoryShareService } from '../../services/categoryShare.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    FormsModule,
    NgIf,
    RouterLink,
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
  public categories: Array<Category> = [];
  public categoryShares: Array<CategoryShare> = [];

  constructor(
    private userService: UserService,
    private groupService: GroupService, 
    private groupMemberService: GroupMemberService,
    private categoryService: CategoryService,
    private categoryShareService: CategoryShareService,
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
      this.snackBarService.open('Username already in group', 'info');
    }
  }

  async getCategoriesData(): Promise<void> {
    // Get categories data
    try {
      const categoryShares = await lastValueFrom(this.categoryShareService.getGroupCategoryShares(this.id_group));
      this.categoryShares = categoryShares!;
      const categories = await lastValueFrom(this.categoryService.getGroupCategories(this.id_group));
      this.categories = categories!;
    } catch (error) {
      // TODO: handle error
      this.snackBarService.open("getCategories error: " + error, 'info');
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
  async createCategory(formData: any): Promise<void> {
    try {
      let total_percentage = 0;
      
      // Obtengo datos para las categoryShares
      const newCategoryName = formData.newCategoryName;
      if (newCategoryName === "") {
        this.snackBarService.open("El nombre de la categoría no puede estar vacío", 'info');
        return;
      }
      
      let newCategoryShares: Array<CategoryShare> = new Array<CategoryShare>;
      for (const key in formData) {
        if (!key.startsWith("percentage")) {
          continue;
        }
        const id_user = Number(key.replace("percentage", ""));
        
        let categoryShare = new CategoryShare();
        categoryShare.id_cs = 0; // se setea pero no se usa. Se genera uno nuevo en la base de datos. 
        categoryShare.id_group = this.id_group;
        categoryShare.id_user = id_user;
        categoryShare.category_name = newCategoryName;
        categoryShare.share_percentage = Number(formData[key]);
        total_percentage += categoryShare.share_percentage;
        newCategoryShares.push(categoryShare as CategoryShare);
      }

      if (total_percentage !== 100) {
        this.snackBarService.open("El porcentaje total debe ser 100%", 'info');
        return;
      }

      // Creo la Category
      const newCategory = new Category();
      newCategory.name = newCategoryName;
      newCategory.description = "Por ahora no tenemos input de descripcion.";
      newCategory.id_group = this.id_group;
      await lastValueFrom(this.categoryService.createCategory(newCategory)) as Category;
      console.log(newCategoryShares); 
      // Creo los CategoryShares
      while (newCategoryShares.length > 0) {
        let cs = newCategoryShares.pop(); 
        await lastValueFrom(this.categoryShareService.createCategoryShare(cs as CategoryShare)) as CategoryShare;
      }

      // Refresco la lista de categorias
      await this.getGroupData();
      await this.getMembersData();
      await this.getCategoriesData();
      } catch (error) {
        this.snackBarService.open('' + error, 'info');
      }
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