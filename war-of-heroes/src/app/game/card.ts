import { Scene } from "phaser";
import { Hero } from "../hero";

export default class Card {
    constructor(scene: Scene, hero: Hero, x: number, y: number) {
        var card = scene.add.image(x, y, 'heroCard').setScale(0.3, 0.3).setInteractive();
        //var heroName = scene.add.text(0, 0, hero.name, {font: "16px Arial", color: "#333333"});
        //var cardContainer = scene.add.container(x, y, [heroName, card]).setInteractive(new Phaser.Geom.Circle(0, 0, 100), Phaser.Geom.Circle.Contains);
        scene.input.setDraggable(card);

        // TODO: Replace placeholder card image, add text from hero object and place it into a draggable container
    }
}