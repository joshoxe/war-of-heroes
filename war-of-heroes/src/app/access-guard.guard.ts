import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
    constructor(private userService: UserService) {

    }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiresLogin = route.data.requiresLogin || false;

    if (requiresLogin) {
      return this.userService.isSignedIn();
    }

    return true;
  }
}