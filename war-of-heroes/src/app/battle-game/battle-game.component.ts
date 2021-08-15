import { Component, OnInit, Input } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import Phaser from 'phaser';
import { User } from '../user';
import { UserService } from '../user.service';
import { environment } from 'src/environments/environment';
import Card from '../game/card';
import { Hero } from '../hero';


@Component({
  selector: 'app-battle-game',
  templateUrl: './battle-game.component.html',
  styleUrls: ['./battle-game.component.css']
})
export class BattleGameComponent implements OnInit {
  @Input()
  socket: Socket

  testObject = {
    prop1: "1",
    prop2: "2"
  }

  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  public static HEIGHT: number = window.innerHeight;
  public static WIDTH: number = window.innerWidth;

  constructor(private userService: UserService) {
    this.config = {
      type: Phaser.AUTO,
      height: BattleGameComponent.HEIGHT,
      width: BattleGameComponent.WIDTH,
      scene: [ MainScene ],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 }
        }
      },
      backgroundColor: '#22384f'
    };
   }

   ngOnInit() {}

   ngAfterViewInit(): void {
    const user = this.userService.getUser();
    const jwtToken = this.userService.getUserJwtToken();
    var deck;
    this.userService.getUserDeck().subscribe(deckData => {
      deck = deckData;
      this.phaserGame = new Phaser.Game(this.config);
      this.phaserGame.scene.start('main', {user: user, jwtToken: jwtToken, deck: deck});
    })
    
  }
}


class MainScene extends Phaser.Scene {
    user: User;
    jwtToken: string;
    deck: number[];
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
    //console.log(this.user);
    this.jwtToken = args.jwtToken;
    //console.log(jwtToken, this.jwtToken)
    this.deck = args.deck;

  }

  create() {

    this.socket.onAny((eventName, data) => {

    this.socket = io(environment.gameServerUrl);

    this.socket.onAny((eventName, data) => {

      if (eventName == "matchmaking") {
        // Pass the auth tokens so the server can call API endpoints for user data
        // Pass user deck here
        this.socket.emit("matchmaking", [this.user.id, this.user.firstName, this.jwtToken, this.user.accessToken]);
      }

      if (eventName == "ready") {
        this.readyToLoad = true;
        this.matchmakingInProgress = false;
      }

      if (eventName == "opponentDeck") {

      }

      if (eventName == "message"){
        console.log(data);
      }

      if (eventName == "win") {
        console.log("YOU WON")
      }
      if (eventName == "lose") {
        console.log("YOU LOSE")
      }
    })

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
  })
  }
  preload() {
    this.load.image('heroCard', 'assets/images/card.png');
  }
  update() {
    if (this.readyToLoad == true && this.gameReady === false) {
      for (let i = 0; i < this.deck.length; i++) {
        const heroId = this.deck[i];
        var testHero: Hero = {
          name: "Test Hero",
          attackDamage: 1,
          description: "A test Hero",
          id: 1,
          ultimateAttackDamage: 5
        };
  
        new Card(this, testHero, 475 + (i * 155), 650);
      }
      this.gameReady = true;
    }

  }
}