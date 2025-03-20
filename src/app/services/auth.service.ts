  import { Injectable } from '@angular/core';
  import { Router } from '@angular/router';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import {UserModel} from '../models/UserModel';
  import { environment } from '../environments/environment';
  import { TokenDto } from '../dtos/TokenDto';
import { UserDto } from '../dtos/UserDto';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private isAuthenticated = false;

    constructor(private router: Router,
      private httpClient: HttpClient) { }

    postLogin = (userModel: UserModel) => {
      return this.httpClient.post<TokenDto>(environment.apiUrl + "/auth/signin", userModel);
    }

    getMyUser = (token:any) => {
      return this.httpClient.get<UserModel>(environment.apiUrl + "/users/my-account", this.settingHeader(token).httpOptions);
    }

    getAllUsers = (token:any) => {
      return this.httpClient.get<UserDto>(environment.apiUrl + "/users", this.settingHeader(token).httpOptions);
    }

    postSignUp = (userModel: UserModel, token:any) => {
      return this.httpClient.post(environment.apiUrl + "/auth/register", userModel, this.settingHeader(token).httpOptions);
    }

    putUserById = (userModel: UserModel, userId: string, token:any) => {
      return this.httpClient.put<UserModel>(environment.apiUrl + `/users/${userId}`, userModel, this.settingHeader(token).httpOptions);
    }

    getDeleteUser = (userId:string, token:any) => {
      return this.httpClient.delete<UserModel>(environment.apiUrl + `/users/${userId}`, this.settingHeader(token).httpOptions);
    }

    putSelfEditById = (userModel: UserModel, token:any) => {
      return this.httpClient.put<UserModel>(environment.apiUrl + `/users/self-edit`, userModel, this.settingHeader(token).httpOptions);
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
