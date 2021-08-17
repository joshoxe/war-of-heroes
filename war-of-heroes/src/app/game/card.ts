import { Scene } from "phaser";
import { Hero } from "../hero";

export default class Card {
    constructor(scene: Scene, hero: Hero, x: number, y: number, draggable: boolean = true) {
        var card = scene.add.image(x, y, 'heroCard').setScale(0.3, 0.3)
        var heroName = scene.add.text(x - 60, y + 50, hero.name, {font: "14px Arial", color: "#333333", });
        var cardContainer = scene.add.container(x, y, [card, heroName]).setInteractive(new Phaser.Geom.Circle(x, y, 100), Phaser.Geom.Circle.Contains);
        cardContainer.setData({hero: hero});

        if (draggable) {
            cardContainer.setInteractive();
            scene.input.setDraggable(cardContainer);
        }
    }
}