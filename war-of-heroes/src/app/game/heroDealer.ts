import { Scene } from 'phaser';
import { BattleGameComponent } from '../battle-game/battle-game.component';
import { Hero } from '../hero';
import Card from './card';

export class HeroDealer {
  scene: Scene;
  userCards: Phaser.GameObjects.Container[] = [];
  opponentCards: Phaser.GameObjects.Container[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
  }

  loadUserCards(userHand: Hero[]) {
    var height = this.scene.game.canvas.height;
    var width = this.scene.game.canvas.width;
    const centerX = width / 2;
    var y = height * 0.38;

    for (let i = 0; i < userHand.length; i++) {
      const midPoint = Math.floor(userHand.length / 2);
      var x = centerX - centerX / 2;
      if (i < midPoint) {
        x = x - (200 - i * 100);
      } else if (i > midPoint) {
        x = x + (i - midPoint) * 100;
      }
      const hero = userHand[i];
      const card = new Card(this.scene);
      this.userCards.push(card.makeCard(hero, x, y));
    }

    console.log(`Sanity check, 0th card is at x: ${this.userCards[0].x}`);
  }

  removeUserHand() {
    for (let i = 0; i < this.userCards.length; i++) {
      const cardContainer = this.userCards[i];
      cardContainer.destroy();
    }

    this.userCards = [];
  }

  loadOpponentCards(opponentHand: Hero[]) {
    var width = this.scene.game.canvas.width;
    const centerX = width / 2;
    var y = 90;

    for (let i = 0; i < opponentHand.length; i++) {
      const midPoint = Math.floor(opponentHand.length / 2);
      var x = centerX - centerX / 2;
      if (i < midPoint) {
        x = x - (200 - i * 100);
      } else if (i > midPoint) {
        x = x + (i - midPoint) * 100;
      }

      const hero = opponentHand[i];
      const card = new Card(this.scene);
      this.opponentCards.push(card.makeCard(hero, x, y, false));
    }
  }

  removeOpponentHand() {
    for (let i = 0; i < this.opponentCards.length; i++) {
      const cardContainer = this.opponentCards[i];
      cardContainer.destroy();
    }

    this.opponentCards = [];
  }

  disableInteractive(): void {
    for (let i = 0; i < this.userCards.length; i++) {
      const card = this.userCards[i];
      card.disableInteractive();
    }
  }

  enableInteractive(): void {
    for (let i = 0; i < this.userCards.length; i++) {
      const card = this.userCards[i];
      card.setInteractive();
    }
  }

  getOpponentHeroPlayed(hero: Hero): Phaser.GameObjects.Container | null {
    for (let i = 0; i < this.opponentCards.length; i++) {
      const card = this.opponentCards[i];

      if (JSON.stringify(card.getData('hero')) === JSON.stringify(hero)) {
        return card;
      }
    }

    return null;
  }
}
