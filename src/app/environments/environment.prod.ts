import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: true,
  apiUrl:'https://meeple-api.herokuapp.com/meeple-api',
  httpOptions : {
    headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa('link:hyruleAdventure')
    })
  }
};

