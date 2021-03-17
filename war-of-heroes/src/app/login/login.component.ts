import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  error: string;
  googleUser: SocialUser;
  signedIn: boolean;
  user: User;

  constructor(
    private authService: SocialAuthService,
    private userService: UserService
  ) {}

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.googleUser = user;
      this.signedIn = user != null;

      if (!this.signedIn) {
        this.error = "Couldn't sign you in.";
        return;
      }

      this.loginUser();
      this.userService.setUser(this.user);
    });
  }

  loginUser() {
    this.userService
      .loginUser(this.googleUser)
      .subscribe((user) => (this.user = user));
  }
}
