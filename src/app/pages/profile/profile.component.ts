import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserModel } from '../../models/UserModel';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoleDto } from '../../dtos/UserRoleDto';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  user: UserModel = new UserModel();
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedUser();
  }

  getLoggedUser(): void {
    if (this.getLocalStorage("token") != null) {
      this.authService.getMyUser(this.getLocalStorage("token")).subscribe((data) => {
        this.user = data;

        if (this.user?.roles?.some(item => item.name?.toLowerCase().includes("admin"))) {
          this.isAdmin = true;
        }

      });
    }
  }

  onClickEdit(data:NgForm): void {
      
      var adminRole: UserRoleDto = new UserRoleDto();
      adminRole.name = "ROLE_ADMINISTRATOR";
  
      var userRole: UserRoleDto = new UserRoleDto();
      userRole.name = "ROLE_CUSTOMER";
  
      data.value.admin ? this.user.roles = [adminRole]: this.user.roles = [userRole];
  
      this.authService.putSelfEditById(this.user,this.getLocalStorage("token")).subscribe(
        {
          next: (data) => { console.log('success', 'Usuário alterado'), location.reload()},
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
