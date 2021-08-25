import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-heroes',
  templateUrl: './user-heroes.component.html',
  styleUrls: ['./user-heroes.component.css']
})
export class UserHeroesComponent implements OnInit {

  constructor(private heroService: HeroService, private userService: UserService) {}
  ngOnInit(): void {
  }

  heroesInventory: Hero[];
  heroesDeck: Hero[];
  selectedHero?: Hero;
  user: User;

  ngAfterViewInit(): void {
    this.heroesInventory = [];    
    this.userService.getUserInventory().subscribe((ids) => {
      this.getHeroes(ids).subscribe((heroes) => {
        this.heroesInventory = heroes });
    });
  }
  
  /**
   * Gets a list of Hero objects from a list of hero `ids`
   * @param ids A list of IDs representing heroes
   * @returns A list of Hero objects from the Hero API for each ID
   */
  getHeroes(ids: number[]): Observable<Hero[]> {
    return this.heroService.getHeroesFromList(ids);
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}
