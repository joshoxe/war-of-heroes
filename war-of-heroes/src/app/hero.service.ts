import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http: HttpClient) { }

  heroesUrl = 'https://localhost:44398/hero';

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHeroesFromList(ids: number[]): Observable<Hero[]> {
    return this.http.post<Hero[]>(this.heroesUrl + "/ids", { heroIds: ids });
  }
  
}
