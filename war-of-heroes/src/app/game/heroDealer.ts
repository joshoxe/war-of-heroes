import { Scene } from 'phaser';
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
        for (let i = 0; i < this.userDeck.length; i++) {
            const hero = this.userDeck[i];
            new Card(this.scene, hero, 475 + i * 160, 700);
          }

        for (let i = 0; i < this.opponentDeck.length; i++) {
            const hero = this.opponentDeck[i];
            new Card(this.scene, hero, 475 + i * 160, 200, false);
        }
    }
}