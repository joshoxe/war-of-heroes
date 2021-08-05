import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AccessGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const requiresLogin = route.data.requiresLogin || false;

    if (requiresLogin) {
      await this.userService.refreshAuth().subscribe(
        (user) => {
          this.userService.setUser(user);
          return true;
        },
        (err) => {
          this.router.navigate(['login']);
          return false;
        }
      );
    }

    return true;
  }
}
