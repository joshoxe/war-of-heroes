import { Component, OnInit, Input } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import Phaser from 'phaser';
import { User } from '../user';
import { UserService } from '../user.service';
import { environment } from 'src/environments/environment';


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

  constructor() {
    super({ key: 'main' });
  }

  init(user, jwtToken, deck) {
    this.user = user;
    this.jwtToken = jwtToken;
    this.deck = deck;
  }

  create() {
    var gameOver = false;
    var gameReady = false;
    var matchmakingInProgress = true;

    this.socket = io(environment.gameServerUrl);

    this.socket.onAny((eventName, data) => {

      if (eventName == "matchmaking") {
        // Pass the auth tokens so the server can call API endpoints for user data
        this.socket.emit("matchmaking", [this.user.id, this.user.firstName, this.jwtToken, this.user.accessToken]);
      }

      if (eventName == "ready") {
        gameReady = true;
        matchmakingInProgress = false;
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

     var winButton = this.add.text(75, 350, ['WIN GAME']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

     winButton.on('pointerdown',() => {
      this.socket.emit("win");
    })
  }
  preload() {

  }
  update() {
    console.log('update method');
  }
}