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

  testObject = {
    prop1: '1',
    prop2: '2',
  };

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  public static HEIGHT: number = window.innerHeight;
  public static WIDTH: number = window.innerWidth;

  constructor(private userService: UserService) {
    this.config = {
      type: Phaser.AUTO,
      height: BattleGameComponent.HEIGHT,
      width: BattleGameComponent.WIDTH,
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
      });
    });
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
  matchmakingInProgress = true;
  
  gameManager: Game;
  heroDealer: HeroDealer;

  constructor() {
    super({ key: 'main' });
  }

  init(args: any) {
    this.user = args.user;
    this.jwtToken = args.jwtToken;
    
    var player = new Player(this.user.firstName);
    this.gameManager = new Game(this, player);
    this.gameManager.setPlayerInventoryIds(args.inventory);
  }

  create() {
    this.cameras.main.setRoundPixels(true);
    const matchmakingText = this.add.text(BattleGameComponent.WIDTH / 2, BattleGameComponent.HEIGHT / 2, 'Finding an opponent..',  {font: "24px Lato" });
    this.socket = io(environment.gameServerUrl);

    this.socket.onAny((eventName, data) => {
      if (eventName == 'matchmaking') {
        this.socket.emit('matchmaking', [
          this.user.id,
          this.user.firstName,
          this.gameManager.player,
          this.jwtToken,
          this.user.accessToken,
        ]);
      }

      /**
       * playerInventory: Event received when the server has retrieved the heroes from the database based on the IDs from the user's inventory
       * `data` will contain an array of heroes from the user's inventory - the inventory in this instance is the database version.
       */
      if (eventName == 'playerInventory') {
        this.gameManager.setPlayerInventory(data);
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
        this.heroDealer = new HeroDealer(this);
        
        var zone = new HeroZone(this);
        zone.createHeroZone(BattleGameComponent.WIDTH / 2 - 100, BattleGameComponent.HEIGHT / 2);

        this.matchmakingInProgress = false;
        matchmakingText.destroy();
        this.socket.emit('ready');
      }

      /**
       * newPlayerHand: Event received when the server sends a new hand from the user's inventory
       * `data` will contain an array of heroes, 5 random heroes picked from the user's inventory
       * The inventory in this instance is the inventory in the game state, not the database.
       */
      if (eventName == "newPlayerHand") {
        const newHand = data;
        this.gameManager.setPlayerCurrentHand(newHand);
        this.heroDealer.loadUserCards(this.gameManager.player.currentHand);
      }

      /**
       * newOpponentHand: Same as newPlayerHand, but for the opponent's new hand
       */
      if (eventName == 'newOpponentHand') {
        const newOpponentHand = data;
        this.gameManager.setOpponentCurrentHand(newOpponentHand);
        this.heroDealer.loadOpponentCards(this.gameManager.opponent.currentHand);
      }

      if (eventName == "yourTurn") {
        this.gameManager.playerTurn = true;
      }

      if (eventName == "opponentTurn") {
        this.gameManager.playerTurn = false;
      }
  
      if (eventName == 'message') {
        console.log(data);
      }

      if (eventName == 'win') {
        console.log('YOU WON');
      }
      if (eventName == 'lose') {
        console.log('YOU LOSE');
      }
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {
      var dropZoneCards = dropZone.data.values.cards;

      if (dropZoneCards >= 3) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        return;
      }
  
      dropZone.data.values.cards++;
      gameObject.x = (dropZone.x - (dropZone.width / 2)) + (dropZone.data.values.cards * 150);
      gameObject.y = dropZone.y - 350;
      gameObject.disableInteractive();
    });
  }
  preload() {
    this.load.image('heroCard', 'assets/images/card.png');
  }
  update() {}
}
