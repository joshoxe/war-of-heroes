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
    throw new Error('Method not implemented.');
  }

  heroesInventory: Hero[];
  heroesDeck: Hero[];
  selectedHero?: Hero;
  user: User;

  ngAfterViewInit(): void {
    this.heroesInventory = [];
    this.heroesDeck = [];
    
    this.userService.getUserInventory().subscribe((ids) => {
      this.getHeroes(ids).subscribe((heroes) => this.heroesInventory = heroes);
    });

    this.userService.getUserDeck().subscribe((ids) => {
      this.getHeroes(ids).subscribe((heroes) => this.heroesDeck = heroes);
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

  async transferToDeckFromInventory(hero: Hero): Promise<void> {
      if (!this.heroesInventory.includes(hero)) {
        return;
      }

      this.heroesInventory.splice(this.heroesInventory.indexOf(hero), 1);
      this.heroesDeck.push(hero);

      // Since a card is being transferred, update the API models
      await this.userService.updateUserDeck(this.heroesDeck.map(h => h.id));
      await this.userService.updateUserInventory(this.heroesInventory.map(h => h.id));
  }

  async transferToInventoryFromDeck(hero: Hero) {
    if (!this.heroesDeck.includes(hero)) {
      return;
    }

    this.heroesDeck.splice(this.heroesDeck.indexOf(hero), 1);
    this.heroesInventory.push(hero);

    // Since a card is being transferred, update the API models
    await this.userService.updateUserDeck(this.heroesDeck.map(h => h.id));
    await this.userService.updateUserInventory(this.heroesInventory.map(h => h.id));
  }
}
