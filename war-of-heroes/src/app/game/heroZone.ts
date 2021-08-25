import { Scene } from "phaser";
import { BattleGameComponent } from "../battle-game/battle-game.component";

export class HeroZone {
    scene: Scene
    constructor(scene: Scene) {
        this.scene = scene;
    }

    createHeroZone(x: number, y: number): Phaser.GameObjects.Zone {
        const width = this.scene.game.canvas.width * 0.8;
        const height = 200;
        var heroZone = this.scene.add.zone(x, y, width, height).setRectangleDropZone(width, height);
        heroZone.setData({ cards: 0 });
        return heroZone;
    }

    renderHeroZone(heroZone) {
        let dropZoneOutline = this.scene.add.graphics();
        dropZoneOutline.lineStyle(4, 0xff69b4);
        dropZoneOutline.strokeRect(heroZone.x - heroZone.input.hitArea.width / 2, heroZone.y - heroZone.input.hitArea.height / 2, heroZone.input.hitArea.width, heroZone.input.hitArea.height);
    }


}