import { Scene } from "phaser";
import { BattleGameComponent } from "../battle-game/battle-game.component";
import { Hero } from "../hero";
import { Player } from "./player";

export class Game {

    playerTurn: boolean;
    player: Player;
    opponent: Player;
    scene: Scene;
    playerHealth: Phaser.GameObjects.Text;
    playerInventory: Phaser.GameObjects.Text;
    playerDiscardPile: Phaser.GameObjects.Text;

    constructor(scene: Scene, player: Player) {
        this.player = player;
        this.scene = scene;
    }

    renderPlayer() {
        var playerNameY = BattleGameComponent.HEIGHT - (BattleGameComponent.HEIGHT * 0.10);
        this.scene.add.text(BattleGameComponent.WIDTH / 2, playerNameY, this.player.name, {font: "28px Lato", color: "#ffffff"});
        this.playerHealth = this.scene.add.text(BattleGameComponent.WIDTH / 2, playerNameY + 25, `Health: ${this.player.health}`, {font: "24px Lato", color: "#ffffff"});

        this.playerDiscardPile = this.scene.add.text(BattleGameComponent.WIDTH * 0.90, BattleGameComponent.HEIGHT * 0.85, `Discard: ${this.player.discardPile.length}`, {font: "14px Lato", color: "#ffffff"});
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

        if (this.playerInventory) {
            this.playerInventory.destroy();
        }
        
        this.playerInventory = this.scene.add.text(20, BattleGameComponent.HEIGHT * 0.85, `Inventory: ${this.player.inventory.length}`, {font: "14px Lato", color: "#ffffff"});
    }

    setPlayerCurrentHand(hand: Hero[]) {
        this.player.currentHand = hand;
    }

    setOpponentCurrentHand(hand: Hero[]) {
        this.opponent.currentHand = hand;
    }

}