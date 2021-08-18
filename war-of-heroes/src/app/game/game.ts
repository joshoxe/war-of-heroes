import { Scene } from "phaser";
import { BattleGameComponent } from "../battle-game/battle-game.component";
import { Hero } from "../hero";
import { Player } from "./player";

export class Game {

    playerTurn: boolean;
    player: Player;
    opponent: Player;
    scene: Scene;

    constructor(scene: Scene, player: Player) {
        this.player = player;
        this.scene = scene;
    }

    renderPlayer() {
        this.scene.add.text(BattleGameComponent.WIDTH / 2, BattleGameComponent.HEIGHT - (BattleGameComponent.HEIGHT * 0.13), this.player.name, {font: "28px Lato", color: "#ffffff"});
        this.scene.add.text(BattleGameComponent.WIDTH / 2, BattleGameComponent.HEIGHT - (BattleGameComponent.HEIGHT * 0.09), `Health: ${this.player.health}`, {font: "24px Lato", color: "#ffffff"});
    }

    setOpponent(opponent: Player) {
        this.opponent = opponent;
        // render opponent
        this.scene.add.text(BattleGameComponent.WIDTH / 2, 5, opponent.name, {font: "28px Lato", color: "#ffffff"});
        this.scene.add.text(BattleGameComponent.WIDTH / 2, 30, `Health:   ${opponent.health}`, {font: "24px Lato", color: "#ffffff"});
    }

    setPlayerInventoryIds(inventory: number[]) {
        this.player.inventoryIds = inventory;
    }
    
    setPlayerInventory(inventory: Hero[]) {
        this.player.inventory = inventory;
    }

    setPlayerCurrentHand(hand: Hero[]) {
        this.player.currentHand = hand;
    }

    setOpponentCurrentHand(hand: Hero[]) {
        this.opponent.currentHand = hand;
    }

}