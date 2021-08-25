import { Component, OnInit, Input } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import Phaser from 'phaser';
import { User } from '../user';
import { UserService } from '../user.service';
import { environment } from 'src/environments/environment';
import Card from '../game/card';
import { Hero } from '../hero';
import { HeroDealer } from '../game/heroDealer';
import { HeroZone } from '../game/heroZone';
import { Player } from '../game/player';
import { Game } from '../game/game';

@Component({
  selector: 'app-battle-game',
  templateUrl: './battle-game.component.html',
  styleUrls: ['./battle-game.component.css'],
})
export class BattleGameComponent implements OnInit {
  @Input()
  socket: Socket;
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  winner: boolean;
  gameOver: boolean = false;

  constructor(private userService: UserService) {
    this.config = {
      type: Phaser.AUTO,
      height: 1080,
      width: 1920,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [MainScene],
      parent: 'gameContainer',
      backgroundColor: '#22384f',
    };
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const user = this.userService.getUser();
    const jwtToken = this.userService.getUserJwtToken();
    var inventory;
    this.userService.getUserInventory().subscribe((inventoryData) => {
      inventory = inventoryData;
      this.phaserGame = new Phaser.Game(this.config);
      this.phaserGame.scene.start('main', {
        user: user,
        jwtToken: jwtToken,
        inventory: inventory,
        endFunction: this.handleEndGame,
      });
    });
  }

  handleEndGame(winner: boolean) {
    this.gameOver = true;
    this.winner = winner;
    console.log('WINNER', this.winner, this.gameOver);
  }
}

class MainScene extends Phaser.Scene {
  user: User;
  jwtToken: string;
  deck: number[];
  userDeck: Hero[];
  opponentDeck: Hero[];
  socket: Socket;
  gameOver = false;
  gameReady = false;
  readyToLoad = false;
  endFunction: any;

  gameManager: Game;

  constructor() {
    super({ key: 'main' });
  }

  init(args: any) {
    this.endFunction = args.endFunction;
    this.user = args.user;
    this.jwtToken = args.jwtToken;

    var player = new Player(this.user.firstName);
    this.gameManager = new Game(this, player);
    this.gameManager.setPlayerInventoryIds(args.inventory);
  }

  create() {
    this.cameras.main.setRoundPixels(true);
    const matchmakingText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Finding an opponent..', { font: '24px Lato' });
    this.socket = io(environment.gameServerUrl);

    this.socket.onAny((eventName, data) => {
      if (eventName == 'matchmaking') {
        this.socket.emit('matchmaking', [this.user.id, this.user.firstName, this.gameManager.player, this.jwtToken, this.user.accessToken]);
      }

      /**
       * playerInventory: Event received when the server has retrieved the heroes from the database based on the IDs from the user's inventory
       * `data` will contain an array of heroes from the user's inventory - the inventory in this instance is the database version.
       */
      if (eventName == 'playerInventory') {
        this.gameManager.player.inventory = data;
      }

      if (eventName == 'roomReady') {
        this.socket.emit('myInfo', this.gameManager.player);
      }

      /**
       * opponentInfo: Event received during matchamking when the opponent client receives it's inventory and sends a `myInfo` event to the server
       * `data` contains a Player object containing all game-related info of the opponent
       */
      if (eventName == 'opponentInfo') {
        const opponent = new Player(data.name);
        this.gameManager.setOpponent(opponent);
        this.gameManager.renderPlayer();
        this.gameManager.renderOpponent();
        const heroDealer = new HeroDealer(this);
        this.gameManager.setHeroDealer(heroDealer);

        var zone = new HeroZone(this);
        zone.createHeroZone(this.game.canvas.width / 2 - 100, this.game.canvas.height / 2);
        matchmakingText.destroy();
        this.socket.emit('ready');
      }

      /**
       * newPlayerHand: Event received when the server sends a new hand from the user's inventory
       * `data` will contain an array of heroes (the hand), 5 random heroes picked from the user's inventory and the user's new inventory state in-game
       * The inventory in this instance is the inventory in the game state, not the database.
       */
      if (eventName == 'newPlayerHand') {
        console.log(data);
        this.gameManager.setPlayer(data);
        this.gameManager.renderPlayer();
        this.gameManager.heroDealer.loadUserCards(this.gameManager.player.currentHand);
      }

      /**
       * newOpponentHand: Same as newPlayerHand, but for the opponent's new hand
       */
      if (eventName == 'newOpponentHand') {
        this.gameManager.setOpponent(data);
        this.gameManager.renderOpponent();
        this.gameManager.heroDealer.removeOpponentHand();
        this.gameManager.heroDealer.loadOpponentCards(this.gameManager.opponent.currentHand);
      }

      if (eventName == 'playerTurn') {
        this.gameManager.playerTurn = true;
        this.gameManager.heroDealer.enableInteractive();
        this.gameManager.renderTurnText('Your Turn');
      }

      if (eventName == 'opponentTurn') {
        this.gameManager.playerTurn = false;
        this.gameManager.heroDealer.disableInteractive();
        this.gameManager.renderTurnText('Opponent Turn');
      }

      if (eventName == 'opponentHeroPlayed') {
        this.gameManager.renderOpponentCardPlayed(data.hero, data.container);
      }

      if (eventName == 'attackPlayed') {
        const player: Player = data;

        this.gameManager.handleAttackOn(player);
      }

      if (eventName == 'endPlayerTurn') {
        this.gameManager.emptyCurrentHand();
        this.gameManager.heroDealer.removeUserHand();
      }

      if (eventName == 'message') {
        console.log(data);
      }

      if (eventName == 'win') {
        this.gameManager.handleWin();
        this.socket.emit('win');
        this.endFunction(true);
        this.sys.game.destroy(true);
      }
      if (eventName == 'lose') {
        this.endFunction(false);
        this.sys.game.destroy(true);
      }
    });

    this.input.on('dragstart', () => {
      this.sound.play('cardPlayed');
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on('drop', (pointer, gameObject, dropZone) => {
      this.gameManager.player.discardPile.push(gameObject.getData('hero'));
      this.gameManager.renderPlayer();
      this.socket.emit('heroPlayed', [gameObject, gameObject.getData('hero')]);

      gameObject.x = dropZone.x - dropZone.width / 2 + dropZone.data.values.cards * 150;
      gameObject.y = dropZone.y - 350;
      gameObject.disableInteractive();

      this.tweens.add({
        targets: gameObject,
        x: this.game.canvas.width,
        duration: 2000,
        ease: 'Power2',
      });

      this.tweens.add({
        targets: gameObject,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
      });
    });
  }
  preload() {
    this.load.image('heroCard', 'assets/images/card.png');
    this.load.audio('attack', 'assets/sounds/attack_sound.wav');
    this.load.audio('cardPlayed', 'assets/sounds/card_played.wav');
    this.load.audio('cardDestroyed', 'assets/sounds/card_destroyed.wav');
  }
  update() {}
}
