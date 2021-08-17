import { Hero } from "../hero";

export class Player {
    name: string;
    health: number = 100;
    inventory: Hero[];
    discardPile: Hero[];
    currentHand: Hero[];
}