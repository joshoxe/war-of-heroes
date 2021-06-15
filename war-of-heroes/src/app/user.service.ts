import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { environment } from './../environments/environment';
import { CookieOptions, CookieService } from 'ngx-cookie';

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
    httpOnly: true,
  };


  signedIn: boolean;
  requestOptions: { headers: HttpHeaders; };

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.requestOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + this.cookieService.get('jwtToken'),
      }),
    };
  }

  loginUser(googleUser: SocialUser): void {
    console.log('Logging user in');
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
          'accessToken',
          user.accessToken,
          this.cookieOptions
        );
      });

    var date: Date = new Date();
    date.setDate(date.getDate() + 1);
    this.cookieOptions.expires = date;

    this.cookieService.put('jwtToken', googleUser.idToken, this.cookieOptions);

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

  async refreshAuth(accessToken: string): Promise<void> {
    var requestBody = { accessToken: accessToken };

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
}
