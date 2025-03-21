import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../models/UserModel';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRoleDto } from '../../dtos/UserRoleDto';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-manager',
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent {

  page = 0;
  pageSize = 10;
  filterTerm!: string;
  userList: Array<UserModel> = [];
  userListFiltered: Array<UserModel> = [];
  modalDetails: UserModel = new UserModel();
  user: UserModel = new UserModel();
  isAdmin: boolean = false;
  loggedUser: UserModel = new UserModel();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    this.getLoggedUser();
    this.loadUsers();
  }

  getLoggedUser(): void {
    if (this.getLocalStorage("token") != null) {
      this.authService.getMyUser(this.getLocalStorage("token")).subscribe((data) => {
        this.loggedUser = data;

        if (this.loggedUser?.roles?.some(item => item.name?.toLowerCase().includes("admin"))) {
          this.isAdmin = true;
        }

        if (!this.isAdmin) this.router.navigate(['/dashboard']).then(()=> location.reload());

      });
    }
  }

  filterUser($event: Event) {

    if (this.filterTerm!=null || this.filterTerm!="") {
      this.userListFiltered = this.userList.filter(item =>
        item.username.toLowerCase().includes(this.filterTerm.toLowerCase()) || item.email.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    } else {
      this.userListFiltered =this.userList;
    }

  }

  loadUsers(): void {
    if (this.getLocalStorage("token") != null) {
      this.authService.getAllUsers(this.getLocalStorage("token")).subscribe((data) => {
          this.userList = data.content;
          this.userListFiltered =this.userList;
      });
    }
  }

  openModel(id: string): void {

    this.userList.map((item) => {
      if (item.userId.includes(id)) {
        this.modalDetails = item ;
      }
    });

    console.log(this.modalDetails);

  }

  onClickAdd() {

    var adminRole: UserRoleDto = new UserRoleDto();
    adminRole.name = "ROLE_ADMINISTRATOR";

    var userRole: UserRoleDto = new UserRoleDto();
    userRole.name = "ROLE_CUSTOMER";

    this.isAdmin ? this.user.roles = [adminRole]: this.user.roles = [userRole];

    this.authService.postSignUp(this.user, this.getLocalStorage("token")).subscribe(
      {
        next: (data) => { console.log('success', 'Usuário adicionado'), location.reload()  },
        error: (err) => { console.log('error', err.error.error); }
      }
    );

  }

  onClickEdit(data:NgForm): void {

    this.modalDetails.username = data.value.username;
    this.modalDetails.email = data.value.email;
    this.modalDetails.password = data.value.password;

    var adminRole: UserRoleDto = new UserRoleDto();
    adminRole.name = "ROLE_ADMINISTRATOR";

    var userRole: UserRoleDto = new UserRoleDto();
    userRole.name = "ROLE_CUSTOMER";

    data.value.admin ? this.modalDetails.roles = [adminRole]: this.modalDetails.roles = [userRole];

    

    this.authService.putUserById(this.modalDetails, this.modalDetails.userId, this.getLocalStorage("token")).subscribe(
      {
        next: (data) => { console.log('success', 'Usuário alterado'), location.reload()},
        error: (err) => { console.log('error', err.error.error); }
      }
    );
  }

  onClickDelete() {

    this.authService.getDeleteUser(this.modalDetails.userId, this.getLocalStorage("token")).subscribe(
      {
        next: (data) => { console.log('success', 'Usuário removido'), location.reload() },
        error: (err) => { console.log('error', err.error.error); }
      }
    );
  }

  getLocalStorage(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

}
