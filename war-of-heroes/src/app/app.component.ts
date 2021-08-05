import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { UserService } from './user.service';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  faCoins = faCoins;
  faGamepad = faGamepad;

  constructor(private userService: UserService, private router: Router, private cookieService: CookieService) {
    // Subscribe to router events in order to check the user's auth token
    // and keep them signed in or out if the token is valid or not
    // router.events.subscribe(async event => {
    //   if (event instanceof NavigationEnd) {
    //     await this.userService.refreshAuth();
    //   }
    // });

  }
  title = 'War of Heroes';

  isSignedIn(): boolean {
    return this.userService.isSignedIn();
  }

  getUserName(): string {
    if (!this.isSignedIn()) {
      return "";
    }

    return this.userService.getUserFirstName();
  }

  getUserCoins(): number {
    return this.userService.getUserCoins();
  }

  getUserWins(): number {
    return this.userService.getUserWins();
  }

  getUserLosses(): number {
    return this.userService.getUserLosses();
  }

  async logout(): Promise<void> {
    await this.userService.logout();

    this.router.navigate(['login']);
  }
}

