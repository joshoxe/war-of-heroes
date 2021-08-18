import { Scene } from 'phaser';
import { BattleGameComponent } from '../battle-game/battle-game.component';
import { Hero } from '../hero';
import Card from './card';

export class HeroDealer {
    scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    loadUserCards(userHand: Hero[]) {
        var height = BattleGameComponent.HEIGHT;
        var width = BattleGameComponent.WIDTH;
        var x = width * 0.1;
        var y = height * 0.38;

        for (let i = 0; i < userHand.length; i++) {
            const hero = userHand[i];
            new Card(this.scene, hero, x + i * 110, y);
          }
    }

    loadOpponentCards(opponentHand: Hero[]) {
        var width = BattleGameComponent.WIDTH;
        var x = width * 0.1;
        var y = 90;

        for (let i = 0; i < opponentHand.length; i++) {
            const hero = opponentHand[i];
            new Card(this.scene, hero, x + i * 110, y, false);
        }
    }
}