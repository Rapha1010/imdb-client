import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { UserModel } from './models/UserModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'imdb-client';
  isAdmin: boolean = false;
  loggedUser: UserModel = new UserModel();
  isLogged: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedUser();
  }

  getLoggedUser(): void {

    if (this.getLocalStorage("token") != null) {
      this.authService.getMyUser(this.getLocalStorage("token")).subscribe((data) => {
        this.loggedUser = data;
        this.isLogged = true;

        if (this.loggedUser?.roles?.some(item => item.name?.toLowerCase().includes("admin"))) {
          this.isAdmin = true;
        }
      });
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => location.reload());
  }

  getLocalStorage(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

}
