import { Scene } from "phaser";

export class Preloader extends Scene {
	constructor() {
		super("Preloader");
	}

	init() {
		//  We loaded this image in our Boot Scene, so we can display it here
		this.add.image(512, 384, "background");
		this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

		const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);
		this.load.on("progress", (progress: number) => {
			bar.width = 4 + 460 * progress;
		});
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("logo", "logo.png");
		this.load.image("star", "star.png");

		this.load.image("apple", "waste/apple.png");
		this.load.image("carton", "waste/carton.png");
		this.load.image("metal-can", "waste/metal-can.png");
		this.load.image("plastic-bottle", "waste/plastic-bottle.png");
		this.load.image("large-carton", "waste/large-carton.png");
		this.load.image("battery", "waste/battery.png");
		this.load.image("cap", "waste/cap.png");

		this.load.image("brown-sad", "bin/brown-sad.png");
		this.load.image("brown-happy", "bin/brown-happy.png");
		this.load.image("blue-sad", "bin/blue-sad.png");
		this.load.image("blue-happy", "bin/blue-happy.png");

		this.load.audio("ding", "audio/ding.wav");
		this.load.audio("failure", "audio/failure.wav");
		this.load.audio("streak", "audio/streak.wav");
		this.load.audio("game-over", "audio/game-over.wav");
	}

	create() {
		this.scene.start("MainMenu");
	}
}
