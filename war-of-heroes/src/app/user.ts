import { UserHero } from "./userHero";

export interface User {
    id: number;
    googleID: number;
    firstName: string;
    userHeroInventories: UserHero;
}