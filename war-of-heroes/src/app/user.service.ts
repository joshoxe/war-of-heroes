import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { environment } from './../environments/environment';
import { CookieOptions, CookieService } from 'ngx-cookie';

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

  constructor(private http: HttpClient, private cookieService: CookieService) {
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

    this.http
      .post<User>(
        `${this.userUrl}/${this.usersEndpoint}/login`,
        googleUser,
        options
      )
      .subscribe((user) => {
        this.user = user;


        this.cookieService.put(
          ACCESS_TOKEN_COOKIE_NAME,
          user.accessToken,
          this.cookieOptions
        );
        this.cookieService.put(
          JWT_TOKEN_COOKIE_NAME,
          googleUser.idToken,
          this.cookieOptions
        );

        console.log(this.cookieService.get(JWT_TOKEN_COOKIE_NAME), this.cookieService.get(ACCESS_TOKEN_COOKIE_NAME));

      });
  }

  private getCookieExpirationDate() {
    var date: Date = new Date();
    date.setDate(date.getDate() + COOKIE_EXPIRATION_DAYS);
    return date;
  }

  isSignedIn(): boolean {
    return this.user != null;
  }

  getUserFirstName(): string {
    if (!this.isSignedIn()) {
      return '';
    }

    return this.user.firstName;
  }

  getUserInventory(): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.userUrl}/${this.usersEndpoint}/${this.user.id}/inventory`,
      this.requestOptions
    );
  }

  getUserDeck(): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.userUrl}/${this.usersEndpoint}/${this.user.id}/deck`,
      this.requestOptions
    );
  }

  /**
   * Replaces a user's entire deck in the API data model with the `deck` provided
   * @param deck a list of numbers representing card IDs in a user's deck
   * @returns an observable of type any to allow for error handling
   */
  async updateUserDeck(deck: number[]): Promise<any> {
    return this.http
      .post<number[]>(
        `${this.userUrl}/${this.usersEndpoint}/${this.user.id}/deck/update`,
        deck,
        this.requestOptions
      )
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
      .post(
        `${this.userUrl}/${this.usersEndpoint}/${this.user.id}/inventory/update`,
        inventory,
        this.requestOptions
      )
      .pipe(
        catchError((e: any) => {
          return throwError(e);
        })
      )
      .toPromise();
  }

  private getAccessToken(): object {
    var accessToken = this.cookieService.get(ACCESS_TOKEN_COOKIE_NAME)

    if (accessToken == null) {
      accessToken = "";
    }

    return { accessToken: accessToken };
  }

  async refreshAuth(): Promise<void> {
    var requestBody = this.getAccessToken();

    this.http
      .post<User>(
        `${this.userUrl}/${this.usersEndpoint}/refresh`,
        requestBody,
        this.requestOptions
      )
      .pipe(
        catchError((e: any) => {
          this.user = null;
          return throwError(e);
        })
      )
      .subscribe((user) => {
        this.user = user;
      });
  }

  async logout(): Promise<void> {
    var requestBody = this.getAccessToken();
    this.http.post(`${this.userUrl}/${this.usersEndpoint}/${this.user.id}/logout`, requestBody, this.requestOptions).pipe(
       catchError((e: any) => {
         return throwError(e);
       })
    ).subscribe(() => {
      this.user = null;
      this.cookieService.remove(JWT_TOKEN_COOKIE_NAME);
      this.cookieService.remove(ACCESS_TOKEN_COOKIE_NAME);
    });
  }
}
