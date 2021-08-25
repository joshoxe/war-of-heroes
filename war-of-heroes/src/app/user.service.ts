import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { environment } from './../environments/environment';
import { CookieOptions, CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { Hero } from './hero';

const COOKIE_EXPIRATION_DAYS = 1;
const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
const JWT_TOKEN_COOKIE_NAME = 'jwtToken';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = environment.userApiUrl;
  private usersEndpoint = 'user';
  private user: User;
  private cookieOptions: CookieOptions = {
    secure: true,
    sameSite: 'strict',
    httpOnly: false, // TODO: Set this to true after debugging
  };

  signedIn: boolean;
  requestOptions: { headers: HttpHeaders };

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    this.requestOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + this.cookieService.get(JWT_TOKEN_COOKIE_NAME),
      }),
    };
  }

  loginUser(googleUser: SocialUser): void {
    this.cookieOptions.expires = this.getCookieExpirationDate();

    const options = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + googleUser.idToken,
      }),
    };

    this.http.post<User>(`${this.userUrl}/${this.usersEndpoint}/login`, googleUser, options).subscribe((user) => {
      this.user = user;

      this.cookieService.put(ACCESS_TOKEN_COOKIE_NAME, user.accessToken, this.cookieOptions);
      this.cookieService.put(JWT_TOKEN_COOKIE_NAME, googleUser.idToken, this.cookieOptions);
    });
  }

  private getCookieExpirationDate() {
    var date: Date = new Date();
    date.setDate(date.getDate() + COOKIE_EXPIRATION_DAYS);
    return date;
  }

  addToUserInventory(heroesBought: number[]): void {
    if (!this.isSignedIn()) {
      console.log('not signed in');
      return;
    }
    this.http.put<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/inventory/add`, heroesBought, this.requestOptions).subscribe();
  }

  removeUserCoins(coins: number) {
    this.http.put<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/coins/add`, coins, this.requestOptions).subscribe(() => {
      this.user.coins -= coins;
    });
  }

  isSignedIn(): boolean {
    return this.user != null;
  }

  getUser(): User | null {
    if (!this.isSignedIn()) {
      return null;
    }

    return this.user;
  }

  getUserId(): number | string {
    if (!this.isSignedIn()) {
      return '';
    }

    return this.user.id;
  }

  getUserFirstName(): string {
    if (!this.isSignedIn()) {
      return '';
    }

    return this.user.firstName;
  }

  getUserInventory(): Observable<number[]> {
    return this.http.get<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/inventory`, this.requestOptions);
  }

  getUserDeck(): Observable<number[]> {
    return this.http.get<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/deck`, this.requestOptions);
  }

  getUserWins(): number {
    if (!this.isSignedIn()) {
      return -1;
    }

    return this.user.wins;
  }

  getUserLosses(): number {
    if (!this.isSignedIn()) {
      return -1;
    }

    return this.user.losses;
  }

  getUserCoins(): number {
    if (!this.isSignedIn()) {
      return -1;
    }

    return this.user.coins;
  }
  /**
   * Replaces a user's entire deck in the API data model with the `deck` provided
   * @param deck a list of numbers representing card IDs in a user's deck
   * @returns an observable of type any to allow for error handling
   */
  async updateUserDeck(deck: number[]): Promise<any> {
    return this.http
      .post<number[]>(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/deck/update`, deck, this.requestOptions)
      .pipe(
        catchError((e: any) => {
          return throwError(e);
        })
      )
      .toPromise();
  }

  /**
   * Replaces a user's entire inventory in the API data model with the `inventory` provided
   * @param inventory a list of numbers representing card IDs in a user's inventory
   * @returns an observable of type any to allow for error handling
   */
  async updateUserInventory(inventory: number[]): Promise<any> {
    return this.http
      .post(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/inventory/update`, inventory, this.requestOptions)
      .pipe(
        catchError((e: any) => {
          return throwError(e);
        })
      )
      .toPromise();
  }

  private getAccessToken(): object {
    var accessToken = this.cookieService.get(ACCESS_TOKEN_COOKIE_NAME);

    if (accessToken == null) {
      accessToken = '';
    }

    return { accessToken: accessToken };
  }

  refreshAuth(): Observable<User> {
    var requestBody = this.getAccessToken();

    if (!this.cookieService.get(JWT_TOKEN_COOKIE_NAME) || !this.cookieService.get(ACCESS_TOKEN_COOKIE_NAME)) {
      console.log('Cookies not defined');
      return throwError('No cookie');
    }

    return this.http.post<User>(`${this.userUrl}/${this.usersEndpoint}/refresh`, requestBody, this.requestOptions).pipe(
      catchError((err) => {
        this.user = null;
        throw throwError(err);
      })
    );
  }

  setUser(user: User) {
    this.user = user;
  }

  async logout(): Promise<void> {
    var requestBody = this.getAccessToken();
    this.http
      .post(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/logout`, requestBody, this.requestOptions)
      .pipe(
        catchError((e: any) => {
          return throwError(e);
        })
      )
      .subscribe(() => {
        this.user = null;
        this.cookieService.remove(JWT_TOKEN_COOKIE_NAME);
        this.cookieService.remove(ACCESS_TOKEN_COOKIE_NAME);
      });
  }

  public getUserAccessToken(): string {
    return this.cookieService.get(ACCESS_TOKEN_COOKIE_NAME);
  }

  public getUserJwtToken(): string {
    return this.cookieService.get(JWT_TOKEN_COOKIE_NAME);
  }
}
