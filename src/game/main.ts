import { Boot } from "./scenes/boot";
import { GameOver } from "./scenes/game-over";
import { SwipeGame } from "./scenes/swipe-game";
import { MainMenu } from "./scenes/main-menu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
	type: AUTO,
	// backgroundColor: "#028af8",
	parent: "game-container",
	width: 550,
	height: 900,
	scene: [Boot, Preloader, MainMenu, SwipeGame, GameOver],
};

const StartGame = (parent: string) => {
	return new Game({ ...config, parent });
};

export default StartGame;
