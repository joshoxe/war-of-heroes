import { Scene } from "phaser";
import { Hero } from "../hero";

export default class Card {
    constructor(scene: Scene, hero: Hero, x: number, y: number, draggable: boolean = true) {
        var card = scene.add.image(x, y, 'heroCard').setScale(0.3, 0.3)
        var heroName = scene.add.text(x - 60, y + 50, hero.name, {font: "14px Lato", color: "#333333", });
        var cardContainer = scene.add.container(x - 100, y, [card, heroName]).setInteractive(new Phaser.Geom.Circle(x, y, 100), Phaser.Geom.Circle.Contains);
        cardContainer.setData({hero: hero});
        cardContainer.setAlpha(0);
        scene.tweens.add({
            targets: cardContainer,
            alpha: 1,
            duration: 2000,
            ease: 'Power2'
        });

        scene.tweens.add({
            targets: cardContainer,
            x: x,
            duration: 500,
            ease: 'Power2'
        });

        if (draggable) {
            cardContainer.setInteractive();
            scene.input.setDraggable(cardContainer);
        }
    }
}