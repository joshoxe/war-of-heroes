import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {

    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiresLogin = route.data.requiresLogin || false;

    if (requiresLogin) {
      if (!this.userService.isSignedIn()) {
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
      }
    }

    return true;
  }
}