import { UserHero } from "./userHero";

export class User {
    id: number;
    googleID: number;
    firstName: string;
    userHeroInventories: UserHero;
    accessToken: string;
    coins: number;
    wins: number;
    losses: number;
}