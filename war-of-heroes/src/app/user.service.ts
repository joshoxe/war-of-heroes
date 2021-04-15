import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://localhost:44328/';
  private usersEndpoint = 'user/login';
  private user: User;
  signedIn: boolean;

  constructor(private http: HttpClient) {}

  loginUser(user: SocialUser): void {
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + user.idToken,
      }),
    };

    this.http
      .post<User>(`${this.baseUrl}${this.usersEndpoint}`, user, options)
      .subscribe((user) => {
        this.user = user;
        this.signedIn = (this.user != null);
      });

  }

  isSignedIn(): boolean {
    return (this.user != null);
  }

  getUserFirstName(): string {
    if (!this.isSignedIn()) {
      return "";
    }

    return this.user.firstName;
  }
}
