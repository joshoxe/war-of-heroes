import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersEndpoint = 'user/login';
  user: User;

  constructor(private http: HttpClient) {}

  setUser(user: User) {
    this.user = user;
  }

  loginUser(user: SocialUser): Observable<User> {
    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + user.idToken,
      }),
    };

    return this.http.post<User>(`https://localhost:44328/${this.usersEndpoint}`, user, options)
  }
}
