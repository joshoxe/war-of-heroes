import { Hero } from "../hero";

export class Player {
    name: string;
    health: number = 100;
    inventoryIds: number[];
    inventory: Hero[];
    discardPile: Hero[];
    currentHand: Hero[];

    constructor(name: string) {
        this.name = name;
        this.inventory = [];
        this.discardPile = [];
        this.currentHand = [];
    }
}