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
      if (user == null) {
        this.error = "Couldn't authorise you with the Google service.";
        return;
      }

      this.googleUser = user;
      this.loginUser();
    });
  }

  loginUser() {
    this.userService.loginUser(this.googleUser);
  }
}
