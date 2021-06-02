import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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

  heroesInventory: Hero[];
  heroesDeck: Hero[];
  selectedHero?: Hero;
  user: User;

  ngOnInit(): void {
    this.heroesInventory = [];
    this.heroesDeck = [];
    
    this.userService.getUserInventory().subscribe((ids) => {
      this.getHeroes(ids).subscribe((heroes) => this.heroesInventory = heroes);
      console.log(this.heroesInventory)
    });

    this.userService.getUserDeck().subscribe((ids) => {
      this.getHeroes(ids).subscribe((heroes) => this.heroesDeck == heroes);
    })
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

  drop(event: CdkDragDrop<string[]>) {
    var currentContainer = event.container.id == "inventory-list" ? this.heroesInventory : this.heroesDeck;
    var previousContainer = event.previousContainer.id == "inventory-list" ? this.heroesInventory : this.heroesDeck;

    if (event.previousContainer === event.container) {
      moveItemInArray(currentContainer, event.previousIndex, event.currentIndex);
      // Currently no implementation to update API model for index changes in a list
    } else {
      transferArrayItem(previousContainer,
                        currentContainer,
                        event.previousIndex,
                        event.currentIndex);

      // Since a card is being transferred, update the API models
      this.userService.updateUserDeck(this.heroesDeck.map(h => h.id)).subscribe();
      this.userService.updateUserInventory(this.heroesInventory.map(h => h.id)).subscribe();
    }
  }
}
