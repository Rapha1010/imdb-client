import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieModel } from '../../models/MovieModel';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserRoleDto } from '../../dtos/UserRoleDto';
import { MovieService } from '../../services/movie.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserModel } from '../../models/UserModel';

@Component({
  selector: 'app-user-manager',
  standalone:true,
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  templateUrl: './movie-manager.component.html',
  styleUrl: './movie-manager.component.css'
})
export class MovieManagerComponent {

  page = 1;
  pageSize = 10;
  filterTerm!: string;
  movieList: Array<MovieModel> = [];
  movieListFiltered: Array<MovieModel> = [];
  modalDetails: MovieModel = new MovieModel();
  movie: MovieModel = new MovieModel();
  isAdmin: boolean = false;
  loggedUser: UserModel = new UserModel();

  constructor(private movieService: MovieService,private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.loadMovies();
  }

  getLoggedUser(): void {
    this.authService.getMyUser(this.getLocalStorage("token")).subscribe((data) => {
      this.loggedUser = data;

      if (this.loggedUser?.roles?.some(item => item.name?.toLowerCase().includes("admin"))) {
        this.isAdmin = true;
      }
    });
  }

  filterMovie($event: Event) {
    if (this.filterTerm!=null || this.filterTerm!="") {
      this.movieListFiltered = this.movieList.filter(item =>
        item.movieName.toLowerCase().includes(this.filterTerm.toLowerCase()) 
        || item.directorName.toLowerCase().includes(this.filterTerm.toLowerCase())
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
        console.log(this.movieList);
    });
  }

  openModel(id: string): void {

    this.movieList.map((item) => {
      if (item.movieId.includes(id)) {
        this.modalDetails = item ;
      }
    })
  }

  onClickAdd() {
    this.movieService.postCreateMovie(this.movie, this.getLocalStorage("token")).subscribe(
      {
        next: (data) => { console.log('success', 'Filme adicionado', data), location.reload() },
        error: (err) => { console.log('error', err.error.error); }
      }
    );
  }

  onClickEdit(data:NgForm): void {

    this.modalDetails.movieId = this.modalDetails.movieId;
    this.modalDetails.genres = data.value.genres;
    this.modalDetails.storyLine = data.value.storyLine;
    this.modalDetails.castNames = data.value.castNames;
    this.modalDetails.directorName = data.value.directorName;

    this.movieService.putMovieById(this.modalDetails, this.modalDetails.movieId, this.getLocalStorage("token")).subscribe(
      {
        next: (data) => { console.log('success', 'Filme alterado'), location.reload()},
        error: (err) => { console.log('error', err.error.error); }
      }
    );
  }

  onClickDelete() {

    this.movieService.getDeleteMovie(this.modalDetails.movieId, this.getLocalStorage("token")).subscribe(
      {
        next: (data) => { console.log('success', 'Filme removido'), location.reload() },
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
