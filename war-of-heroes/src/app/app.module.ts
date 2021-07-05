import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessGuard } from './access-guard.guard';
import { UserHeroesComponent } from './user-heroes/user-heroes.component';
import { HeroCardComponent } from './hero-card/hero-card.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { GridsterModule } from 'angular-gridster2';
import { CookieModule } from 'ngx-cookie';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserHeroesComponent,
    HeroCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    FontAwesomeModule,
    AppRoutingModule,
    DragDropModule,
    GridsterModule,
    CookieModule.forRoot()
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('623630888688-jevgjgdl7enoseinq185v1t447cc30f9.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
