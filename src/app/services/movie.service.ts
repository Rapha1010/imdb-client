import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MovieModel} from '../models/MovieModel';
import { environment } from '../environments/environment';
import { MovieDto } from '../dtos/MovieDto';
import { MovieScoreDto } from '../dtos/MovieScoreDto';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private router: Router,
    private httpClient: HttpClient) { }

  postCreateMovie = (movieModel: MovieModel, token:any) => {
    return this.httpClient.post(environment.apiUrl + "/movies/", movieModel, this.settingHeader(token).httpOptions);
  }

  postMovieScore = (movieScore: MovieScoreDto, movieId: string, token:any) => {
    return this.httpClient.post(environment.apiUrl + `/movies/vote/${movieId}`, movieScore, this.settingHeader(token).httpOptions);
  }

  getAllMovies = (token:any) => {
    return this.httpClient.get<MovieDto>(environment.apiUrl + "/movies", this.settingHeader(token).httpOptions);
  }

  putMovieById = (movieModel: MovieModel, movieId: string, token:any) => {
    return this.httpClient.put<MovieModel>(environment.apiUrl + `/movies/${movieId}`, movieModel, this.settingHeader(token).httpOptions);
  }

  getDeleteMovie = (userId:string, token:any) => {
    return this.httpClient.delete<MovieModel>(environment.apiUrl + `/movies/${userId}`, this.settingHeader(token).httpOptions);
  }

  settingHeader = (token:any) => {
    return {
      httpOptions : {
        headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'Bearer ' + token
        })
      }
    };
  }
}
