import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from './hero';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http: HttpClient) { }

  heroesUrl = environment.heroesApiUrl;

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHeroesFromList(ids: number[]): Observable<Hero[]> {
    return this.http.post<Hero[]>(this.heroesUrl + "/ids", { heroIds: ids });
  }
  
}
