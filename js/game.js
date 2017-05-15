import "pixi";
import "p2";
import Phaser from "phaser";
import Client from "./client.js";
import { Game } from "./stages";

const game = new Phaser.Game(
    16 * 32,
    600,
    Phaser.AUTO,
    document.getElementById("game")
);
game.state.add("Game", Game);
game.state.start("Game");

export default game;
