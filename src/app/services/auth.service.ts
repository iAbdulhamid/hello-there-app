import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../shared-classes-and-interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
    const user: User = {email, password};
    this.http.post(`http://localhost:3000/user/signup`, user).subscribe(respose => {
      console.log(respose);
    });
  }

  login(email: string, password: string) {
    const user: User = {email, password};
    this.http.post(`http://localhost:3000/user/login`, user).subscribe(respose => {
      console.log(respose);
    });
  }


}
