import { Component } from '@angular/core';
import { MovieModel } from '../../models/MovieModel';
import { UserModel } from '../../models/UserModel';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MovieScoreDto } from '../../dtos/MovieScoreDto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,FormsModule,NgxPaginationModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  page = 0;
  pageSize = 10;
  filterTerm!: string;
  movieList: Array<MovieModel> = [];
  movieListFiltered: Array<MovieModel> = [];
  loggedUser: UserModel = new UserModel();
  modalDetails: MovieModel = new MovieModel();
  isAdmin: boolean = false;
  movieScore: MovieScoreDto = new MovieScoreDto();
  isLogged: boolean = false;

  constructor(private movieService: MovieService,private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadMovies();
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

  filterMovie($event: Event) {

    if (this.filterTerm!=null || this.filterTerm!="") {
      this.movieListFiltered = this.movieList.filter(item =>
        item.movieName.toLowerCase().includes(this.filterTerm.toLowerCase()) || item.directorName.toLowerCase().includes(this.filterTerm.toLowerCase())
        || item.genres.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
    } else {
      this.movieListFiltered =this.movieList;
    }

  }

  loadMovies(): void {
    this.movieService.getAllMovies(this.getLocalStorage("token")).subscribe((data) => {
        this.movieList = data.content;
        this.movieListFiltered =this.movieList;
    });
  }

  openModel(id: string): void {

    this.movieList.map((item) => {
      if (item.movieId.includes(id)) {
        this.modalDetails = item ;
      }
    })
  }

  onClickAddScore(data:NgForm): void {  

    this.movieService.postMovieScore(this.movieScore, this.modalDetails.movieId, this.getLocalStorage("token")).subscribe(
      {
        next: (data) => { console.log('success', 'Filme alterado'), location.reload()},
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
