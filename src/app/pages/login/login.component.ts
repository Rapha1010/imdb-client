import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../models/UserModel';
import { TokenDto } from '../../dtos/TokenDto';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  userModel: UserModel = new UserModel();
  isAdmin: boolean = false;
  loggedUser: UserModel = new UserModel();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {

    this.authService.postLogin(this.userModel).subscribe(
      {
        next: (data) => {

            if (data && data.token) {
              this.setLocalStorage(this.userModel, data.token);
              this.router.navigate(['/dashboard']).then(() => location.reload());
            } else {
              console.error('Token não recebido!');
            }
        }
        ,error: (err) => {
          console.log('Erro no login', err);
        }
        
      });
  }

  setLocalStorage(data:UserModel, token: string) {
    localStorage.setItem('email', data.email);
    localStorage.setItem('token', token);
  }

  getLocalStorage(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }


}
