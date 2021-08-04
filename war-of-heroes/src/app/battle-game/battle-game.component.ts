import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';


@Component({
  selector: 'app-battle-game',
  templateUrl: './battle-game.component.html',
  styleUrls: ['./battle-game.component.css']
})
export class BattleGameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  public static HEIGHT: number = window.innerHeight;
  public static WIDTH: number = window.innerWidth;

  constructor() {
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
      backgroundColor: '#ffffff'
    };
   }

  ngOnInit(): void {
    this.phaserGame = new Phaser.Game(this.config);
  }

}


class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  create() {
    var particles = this.add.particles('red');



        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        var logo = this.physics.add.image(400, 100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
  }
  preload() {
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
  }
  update() {
    console.log('update method');
  }
}