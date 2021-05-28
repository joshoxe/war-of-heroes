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
    });

    this.userService.getUserDeck().subscribe((ids) => {
      this.getHeroes(ids).subscribe((heroes) => this.heroesDeck == heroes);
    })
  }
  
  getHeroes(ids: number[]): Observable<Hero[]> {
    return this.heroService.getHeroesFromList(ids);
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  moveItemInInventory(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.heroesInventory, previousIndex, currentIndex)
  }

  moveItemInDeck(previousIndex: number, currentIndex: number): void {
    moveItemInArray(this.heroesDeck, previousIndex, currentIndex)
  }

  drop(event: CdkDragDrop<string[]>) {
    var currentContainer = event.container.id == "inventory-list" ? this.heroesInventory : this.heroesDeck;
    var previousContainer = event.previousContainer.id == "inventory-list" ? this.heroesInventory : this.heroesDeck;

    if (event.previousContainer === event.container) {
      moveItemInArray(currentContainer, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(previousContainer,
                        currentContainer,
                        event.previousIndex,
                        event.currentIndex);
    }  }
}
