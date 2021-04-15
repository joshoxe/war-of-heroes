import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userService: UserService) {
  }
  title = 'War of Heroes';

  isSignedIn(): boolean {
    return this.userService.signedIn;
  }

  getUserName(): string {
    if (!this.isSignedIn()) {
      return "";
    }

    return this.userService.getUserFirstName();
  }
}
