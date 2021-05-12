import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { Hero } from './hero';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'https://localhost:44328/';
  private usersEndpoint = 'user';
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
      .post<User>(`${this.userUrl}${this.usersEndpoint}/login`, user, options)
      .subscribe((user) => {
        this.user = user;
        this.signedIn = (this.user != null);
      });

      localStorage.setItem("idToken", user.idToken);
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

  getUserInventory() : Observable<number[]> {
    console.log(localStorage.getItem("idToken"));
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + localStorage.getItem("idToken"),
      }),
    };

    return this.http
      .get<number[]>(`${this.userUrl}${this.usersEndpoint}/${this.user.id}/inventory`, options);
  }
}
