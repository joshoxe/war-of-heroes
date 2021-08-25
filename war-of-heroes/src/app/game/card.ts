import { Scene } from 'phaser';
import { Hero } from '../hero';

export default class Card {
  scene: Scene;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  makeCard(hero: Hero, x: number, y: number, draggable: boolean = true): Phaser.GameObjects.Container {
    var card = this.scene.add.image(x, y, 'heroCard');
    var heroName = this.scene.add.text(x - 60, y - 70, hero.name, { font: '18px Metal Mania', color: '#815f3c' });
    var heroLabel = this.scene.add.text(x - 60, y - 45, 'Hero', { font: '14px Lato', color: '#966f47' });
    var abilityAmount = this.scene.add.text(x - 60, y - 15, `${hero.ability.amount}`, { font: '14px Metal Mania', color: '#815f3c' });
    var abilityLabel = this.scene.add.text(x - 60, y, `${hero.ability.type}`, { font: '14px Lato', color: '#966f47' });
    var cardContainer = this.scene.add
      .container(x - 100, y, [card, heroName, heroLabel, abilityAmount, abilityLabel])
      .setInteractive(new Phaser.Geom.Circle(x, y, 100), Phaser.Geom.Circle.Contains);
    cardContainer.setData({ hero: hero });
    cardContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: cardContainer,
      alpha: 1,
      duration: 2000,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: cardContainer,
      x: x,
      duration: 500,
      ease: 'Power2',
    });

    if (draggable) {
      cardContainer.setInteractive();
      this.scene.input.setDraggable(cardContainer);
    }

    return cardContainer;
  }
}
