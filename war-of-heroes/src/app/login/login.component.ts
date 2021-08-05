import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  error: string;
  googleUser: SocialUser;
  user: User;
  returnUrl: string;

  constructor(
    private authService: SocialAuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.authService.authState.subscribe((user) => {
      if (user == null) {
        this.error = "Couldn't authorise you with the Google service.";
        return;
      }

      this.googleUser = user;
      this.loginUser();
      this.router.navigate(['']);
    });
  }

  loginUser() {
    this.userService.loginUser(this.googleUser);
  }
}
