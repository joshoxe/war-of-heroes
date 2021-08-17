import { Scene } from 'phaser';
import { BattleGameComponent } from '../battle-game/battle-game.component';
import { Hero } from '../hero';
import Card from './card';

export class HeroDealer {
    scene: Scene;
    userDeck: Hero[];
    opponentDeck: Hero[];

    constructor(scene: Scene, userDeck: Hero[], opponentDeck: Hero[]) {
        this.scene = scene;
        this.userDeck = userDeck;
        this.opponentDeck = opponentDeck;
    }

    loadCards() {
        var width = BattleGameComponent.WIDTH;
        var height = BattleGameComponent.HEIGHT;

        var cardStartingPoint = width * 0.1;
        var userCardVerticalPoint = height * 0.38;
        for (let i = 0; i < this.userDeck.length; i++) {
            const hero = this.userDeck[i];
            new Card(this.scene, hero, cardStartingPoint + i * 110, userCardVerticalPoint);
          }

        for (let i = 0; i < this.opponentDeck.length; i++) {
            const hero = this.opponentDeck[i];
            new Card(this.scene, hero, cardStartingPoint + i * 110, 90, false);
        }
    }
}