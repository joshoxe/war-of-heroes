import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Observable, throwError } from 'rxjs';
import {catchError, map } from 'rxjs/operators';
import { Hero } from './hero';
import { User } from './user';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = environment.userApiUrl;
  private usersEndpoint = 'user';
  private user: User;
  private options = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + localStorage.getItem("idToken"),
    }),
  };

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
      .post<User>(`${this.userUrl}/${this.usersEndpoint}/login`, user, options)
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
    return this.http
      .get<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/inventory`, this.options);
  }

  getUserDeck() : Observable<number[]> {
    return this.http
      .get<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/deck`, this.options);
  }

  /**
   * Replaces a user's entire deck in the API data model with the `deck` provided
   * @param deck a list of numbers representing card IDs in a user's deck
   * @returns an observable of type any to allow for error handling
   */
  updateUserDeck(deck: number[]) : Observable<any> {
    console.log("Updating user deck")
    return this.http.post<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/deck/update`, deck, this.options).pipe(
      catchError((e: any) => {
        return throwError(e);
      })
    );
  }

  /**
   * Replaces a user's entire inventory in the API data model with the `inventory` provided
   * @param inventory a list of numbers representing card IDs in a user's inventory
   * @returns an observable of type any to allow for error handling
   */
  updateUserInventory(inventory: number[]) : Observable<any> {
    return this.http.post(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/inventory/update`, inventory, this.options).pipe(
      catchError((e: any) => {
        return throwError(e);
      })
    );
  }
}