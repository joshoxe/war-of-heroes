import { Scene } from 'phaser';
import { BattleGameComponent } from '../battle-game/battle-game.component';
import { Hero } from '../hero';
import { HeroDealer } from './heroDealer';
import { Player } from './player';

export class Game {
  playerTurn: boolean;
  player: Player;
  opponent: Player;
  scene: Scene;
  heroDealer: HeroDealer;
  playerHealth: Phaser.GameObjects.Text;
  opponentHealth: Phaser.GameObjects.Text;
  opponentName: Phaser.GameObjects.Text;
  playerInventory: Phaser.GameObjects.Text;
  playerDiscardPile: Phaser.GameObjects.Text;
  playerName: Phaser.GameObjects.Text;

  constructor(scene: Scene, player: Player) {
    this.player = player;
    this.scene = scene;
  }

  handleWin() {}

  setHeroDealer(heroDealer: HeroDealer) {
    this.heroDealer = heroDealer;
  }

  emptyCurrentHand() {
    const newDiscardPileAmount = this.player.discardPile.length + this.player.currentHand.length;
    this.playerDiscardPile.setText(`Discard: ${newDiscardPileAmount}`);

    this.player.currentHand = [];
  }

  handleAttackOn(player: Player) {
    if (JSON.stringify(player.name) === JSON.stringify(this.player.name)) {
      this.reloadPlayerAfterAttack(player);
    } else {
      this.reloadOpponentAfterAttack(player);
    }
  }

  reloadPlayerAfterAttack(player: Player) {
    const damage: number = this.player.health - player.health;
    var damageText = this.scene.add
      .text(this.playerHealth.x + 100, this.playerHealth.y - 20, `-${damage}`)
      .setFont('Lato')
      .setFontSize(34)
      .setColor('#FF0000')
      .setAlpha(0)
      .setOrigin(0.5, 0.5);

    this.renderAttackAnimation(damageText);

    this.player.health = player.health;
    this.playerHealth.destroy();
    this.renderPlayer();
  }

  reloadOpponentAfterAttack(player: Player) {
    const damage: number = this.opponent.health - player.health;
    var damageText = this.scene.add
      .text(this.opponentHealth.x + 100, this.opponentHealth.y - 15, `-${damage}`)
      .setFont('Lato')
      .setFontSize(34)
      .setColor('#FF0000')
      .setAlpha(0)
      .setOrigin(0.5, 0.5);

    this.opponent.health = player.health;
    this.renderAttackAnimation(damageText);
    this.renderOpponent();
  }

  private renderAttackAnimation(damageText: Phaser.GameObjects.Text) {
    this.scene.sound.play('attack');
    this.scene.tweens.add({
      targets: damageText,
      alpha: 1,
      duration: 500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: damageText,
          alpha: 0,
          delay: 1000,
          duration: 500,
          ease: 'Sine.easeInOut',
        });

        this.scene.tweens.add({
          targets: damageText,
          scale: 0.1,
          delay: 1000,
          duration: 500,
          ease: 'Sine.easeInOut',
        });
      },
    });
  }

  renderPlayer() {
    var playerNameY = this.scene.game.canvas.height - this.scene.game.canvas.height * 0.1;

    if (this.playerHealth && this.playerName) {
      this.playerName.destroy();
      this.playerHealth.destroy();
    }

    this.playerName = this.scene.add.text(this.scene.game.canvas.width / 2, playerNameY, this.player.name, { font: '28px Lato', color: '#ffffff' });
    this.playerHealth = this.scene.add.text(this.scene.game.canvas.width / 2, playerNameY + 25, `Health: ${this.player.health}`, {
      font: '24px Lato',
      color: '#ffffff',
    });

    if (this.playerDiscardPile && this.playerInventory) {
      this.playerDiscardPile.destroy();
      this.playerInventory.destroy();
    }

    this.playerDiscardPile = this.scene.add.text(
      this.scene.game.canvas.width * 0.9,
      this.scene.game.canvas.height * 0.85,
      `Discard: ${this.player.discardPile.length}`,
      {
        font: '14px Lato',
        color: '#ffffff',
      }
    );
    this.playerInventory = this.scene.add.text(20, this.scene.game.canvas.height * 0.85, `Inventory: ${this.player.inventory.length}`, {
      font: '14px Lato',
      color: '#ffffff',
    });
  }

  setOpponent(opponent: Player) {
    this.opponent = opponent;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  renderOpponent() {
    if (this.opponentHealth && this.opponentName) {
      this.opponentName.destroy();
      this.opponentHealth.destroy();
    }

    console.log(`Opponent name sits at ${this.scene.game.canvas.width / 2}`);
    this.opponentName = this.scene.add.text(this.scene.game.canvas.width / 2, 5, this.opponent.name, { font: '28px Lato', color: '#ffffff' });
    this.opponentHealth = this.scene.add.text(this.scene.game.canvas.width / 2, 30, `Health:   ${this.opponent.health}`, {
      font: '24px Lato',
      color: '#ffffff',
    });
  }

  renderTurnText(text: string) {
    var turnText = this.scene.add
      .text(this.scene.game.canvas.width / 2, this.scene.game.canvas.height / 2, text)
      .setFont('Lato')
      .setFontSize(34)
      .setColor('#ffffff')
      .setAlpha(0)
      .setOrigin(0.5, 0.5);

    this.scene.tweens.add({
      targets: turnText,
      alpha: 1,
      duration: 500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: turnText,
          alpha: 0,
          delay: 1000,
          duration: 500,
          ease: 'Sine.easeInOut',
        });
      },
    });
  }

  renderOpponentCardPlayed(hero: Hero, containerPlayed: Phaser.GameObjects.Container): void {
    const heroContainer = this.heroDealer.getOpponentHeroPlayed(hero);

    this.scene.tweens.add({
      targets: heroContainer,
      x: containerPlayed.x,
      duration: 500,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: heroContainer,
      y: containerPlayed.y,
      duration: 500,
      ease: 'Power2',
    });

    this.scene.tweens.add({
      targets: heroContainer,
      alpha: 0,
      duration: 450,
      ease: 'Power2',
    });
  }

  setPlayerInventoryIds(inventory: number[]) {
    this.player.inventoryIds = inventory;
  }

  setPlayerCurrentHand(hand: Hero[]) {
    this.player.currentHand = hand;
  }

  setOpponentCurrentHand(hand: Hero[]) {
    this.opponent.currentHand = hand;
  }
}
