import { Component, OnInit } from '@angular/core';
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

  heroes: Hero[];
  selectedHero?: Hero;
  user: User;

  ngOnInit(): void {
    this.userService.getUserInventory().subscribe((ids) => {
      this.getHeroes(ids);
    });
  }

  getHeroes(ids: number[]): void {
    this.heroService.getHeroesFromList(ids).subscribe((heroes) => this.heroes = heroes);
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }
}
