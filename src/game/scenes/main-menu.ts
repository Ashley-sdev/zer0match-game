import { type GameObjects, Scene } from "phaser";

import { EventBus } from "../event-bus";

export class MainMenu extends Scene {
	background: GameObjects.Image;

	constructor() {
		super("MainMenu");
	}

	create() {
		this.background = this.add.image(512, 384, "background");

		const blueBag = this.add.sprite(this.scale.width / 2, this.scale.height * 0.4, "blue-happy");
		blueBag.setScale(0.6);
		blueBag.setOrigin(0.5, 0.5);
		blueBag.setDepth(100);

		this.tweens.add({
			targets: blueBag,
			angle: 10,
			duration: 1000,
			ease: "Sine.easeInOut",
			yoyo: true,
			repeat: -1,
		});
		this.add
			.text(this.scale.width / 2, blueBag.y + 150, "zer0.match", {
				fontFamily: "Space Grotesk",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		const playText = this.add.text(this.scale.width / 2, this.scale.height * 0.65, "Click anywhere to play", {
			fontFamily: "Space Grotesk",
			fontSize: 24,
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 8,
		});
		playText.setOrigin(0.5);

		this.input.once("pointerdown", () => {
			this.startGame();
		});

		EventBus.emit("current-scene-ready", this);
	}

	startGame() {
		this.cameras.main.fadeOut(500, 255, 255, 255);
		this.scene.start("SwipeGame");
	}
}
