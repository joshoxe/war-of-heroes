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
    var deck;
    this.userService.getUserDeck().subscribe((deckData) => {
      deck = deckData;
      this.phaserGame = new Phaser.Game(this.config);
      this.phaserGame.scene.start('main', {
        user: user,
        jwtToken: jwtToken,
        deck: deck,
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

  constructor() {
    super({ key: 'main' });
  }

  init(args: any) {
    this.user = args.user;
    this.jwtToken = args.jwtToken;
    this.deck = args.deck;
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
          this.deck,
          this.jwtToken,
          this.user.accessToken,
        ]);
      }

      if (eventName == 'ready') {
        if (!data) {
          console.log('An error occurred setting up the game');
          return;
        }

        this.userDeck = data;
        this.socket.emit('myDeck', this.userDeck);
      }

      if (eventName == 'opponentDeck') {
        this.opponentDeck = data;
        const heroDealer = new HeroDealer(
          this,
          this.userDeck,
          this.opponentDeck
        );

        heroDealer.loadCards();
        
        var zone = new HeroZone(this);
        var heroZone = zone.createHeroZone(BattleGameComponent.WIDTH / 2, BattleGameComponent.HEIGHT / 2);

        this.matchmakingInProgress = false;
        matchmakingText.destroy();
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
