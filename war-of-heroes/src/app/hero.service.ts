import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from './hero';
import { environment } from './../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private options = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    }),
  };
  constructor(private http: HttpClient, private userService: UserService) {}

  heroesUrl = environment.heroesApiUrl;

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl, this.options);
  }

  getHeroesFromList(ids: number[]): Observable<Hero[]> {
    return this.http.post<Hero[]>(this.heroesUrl + '/ids', { heroIds: ids }, this.options);
  }

  buyBoosterPack(): Observable<Hero[]> | null {
    return this.http.get<Hero[]>(this.heroesUrl + '/packs/5', this.options);
  }
}
