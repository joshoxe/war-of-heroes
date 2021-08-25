import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  constructor(private userService: UserService, private heroService: HeroService) {}

  heroesBought: Hero[] = [];

  ngOnInit(): void {}

  async buyBoosterPack() {
    if (this.userService.getUserCoins() < 50) {
      console.log('not enough coins');
      return;
    }

    this.heroService.buyBoosterPack().subscribe((heroes) => {
      if (!heroes) {
        return;
      }

      var inventoryIds = [];

      for (let i = 0; i < heroes.length; i++) {
        const hero = heroes[i];
        console.log(hero);
        inventoryIds.push(hero.id);
      }

      this.userService.removeUserCoins(50);
      this.userService.addToUserInventory(inventoryIds);
      this.heroesBought = heroes;
    });
  }
}
