import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessGuard } from './access-guard.guard';
import { BattleGameComponent } from './battle-game/battle-game.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {requiresLogin: true},
    canActivate: [ AccessGuard ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {requiresLogin: true},
    canActivate: [ AccessGuard ]
  },
  {
    path: 'battle-game',
    component: BattleGameComponent,
    data: {requiresLogin: true},
    canActivate: [ AccessGuard ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
