import { Scene } from "phaser";

export enum WasteItemTexture {
	Apple = "apple",
	Carton = "carton",
	Plastic = "plastic-bottle",
	MetalCan = "metal-can",
	LargeCarton = "large-carton",
	Battery = "battery",
	Cap = "cap",
}

export const UserBlueBinItems = "UserBlueBinItems";
export const UserBrownBinItems = "UserBrownBinItems";
export const TotalCount = "TotalCount";

export const blueBagItems = [
	WasteItemTexture.Plastic,
	WasteItemTexture.Carton,
	WasteItemTexture.MetalCan,
	WasteItemTexture.Cap,
];
export const brownBagItems = [WasteItemTexture.Apple, WasteItemTexture.LargeCarton, WasteItemTexture.Battery];

export class SwipeGame extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	itemsGroup: Phaser.GameObjects.Group;
	blueBag: Phaser.GameObjects.Sprite;
	brownBag: Phaser.GameObjects.Sprite;
	activeWasteItem: Phaser.GameObjects.Sprite;

	scoreText: Phaser.GameObjects.Text;
	failureCircles: Phaser.GameObjects.Graphics[] = [];
	wasteItemTextures = [
		WasteItemTexture.Apple,
		WasteItemTexture.Carton,
		WasteItemTexture.Plastic,
		WasteItemTexture.MetalCan,
		WasteItemTexture.LargeCarton,
		WasteItemTexture.Battery,
		WasteItemTexture.Cap,
	];

	score = 0;
	blueStreak = 0;
	brownStreak = 0;
	happyStreakRequirement = 5;
	failures = 0;
	maxFailures = 3;
	totalCount = 0;

	constructor() {
		super("SwipeGame");
	}

	create() {
		this.camera = this.cameras.main;
		this.camera.fadeIn(500, 255, 255, 255);
		this.background = this.add.image(512, 384, "background");

		this.initRegistryValues();
		this.scoreText = this.add.text(this.scale.width / 2, 80, "0", {
			fontSize: 100,
			color: "#ffffff",
			fontFamily: "Space Grotesk",
			fontStyle: "bold",
		});

		this.scoreText.setDepth(100);
		this.scoreText.setOrigin(0.5, 0.5);

		const scoreStar = this.add.star(this.scoreText.x, this.scoreText.y, 6, 20, 46, 0xebc034);
		scoreStar.setScale(1.2);
		this.tweens.add({
			targets: scoreStar,
			angle: 360,
			duration: 8000,
			repeat: -1,
			ease: "Linear",
		});

		this.updateFailures();
		this.blueBag = this.add.sprite(0, 434, "blue-sad");
		this.blueBag.setFlipX(true);
		this.blueBag.setRotation(45);
		this.blueBag.setOrigin(0.5, 0.5);
		this.blueBag.setScale(0.7);

		this.brownBag = this.add.sprite(this.scale.width, 434, "brown-sad");
		this.brownBag.setRotation(-45);
		this.brownBag.setOrigin(0.5, 0.5);
		this.brownBag.setScale(0.7);

		// bags rocking back and forth
		this.tweens.add({
			targets: this.blueBag,
			angle: 5,
			duration: 1000,
			ease: "Sine.easeInOut",
			yoyo: true,
			repeat: -1,
		});

		this.tweens.add({
			targets: this.brownBag,
			angle: -5,
			duration: 1000,
			ease: "Sine.easeInOut",
			yoyo: true,
			repeat: -1,
		});

		this.activeWasteItem = this.add.sprite(this.scale.width / 2, 434, "apple");
		this.resetActiveWasteItem();
		this.activeWasteItem.setOrigin(0.5, 0.5);
		this.activeWasteItem.setScale(0.8);
		const activeItemShape = new Phaser.Geom.Rectangle(this.activeWasteItem.x - 150, 0, 250, this.camera.height);

		this.activeWasteItem.setInteractive({
			hitArea: activeItemShape,
			hitAreaCallback: Phaser.Geom.Rectangle.Contains,
			draggable: true,
			useHandCursor: true,
		});

		this.activeWasteItem.on("dragstart", () => {
			this.tweens.add({
				targets: this.activeWasteItem,
				scale: 0.6,
				duration: 200,
				ease: "Power2",
			});
		});

		this.activeWasteItem.on("drag", (pointer: Phaser.Input.Pointer) => {
			this.activeWasteItem.x = pointer.x;
		});

		this.activeWasteItem.on("dragend", () => {
			this.tweens.add({
				targets: this.activeWasteItem,
				scale: 0.8,
				duration: 200,
				ease: "Power2",
			});

			const isInBlueBag = Phaser.Geom.Rectangle.Contains(
				this.blueBag.getBounds(),
				this.activeWasteItem.x,
				this.activeWasteItem.y,
			);

			if (isInBlueBag) {
				this.handleBagInteraction(true);
				return;
			}

			const isInBrownBag = Phaser.Geom.Rectangle.Contains(
				this.brownBag.getBounds(),
				this.activeWasteItem.x,
				this.activeWasteItem.y,
			);

			if (isInBrownBag) {
				this.handleBagInteraction(false);
				return;
			}

			this.activeWasteItem.x = this.scale.width / 2;
		});

		this.events.on("wake", () => {
			this.initRegistryValues();
			this.score = 0;
			this.failures = 0;
			this.totalCount = 0;
			this.scoreText.setText(this.score.toString());
			this.scoreText.setPosition(this.scale.width / 2, this.scoreText.y);
			this.updateFailures();
			this.resetActiveWasteItem();
			this.resetStreaks();
		});
	}

	initRegistryValues() {
		this.registry.set(UserBlueBinItems, {});
		this.registry.set(UserBrownBinItems, {});
		this.registry.set(TotalCount, 0);
	}

	handleBagInteraction(isBlue: boolean) {
		const bagItems = isBlue ? blueBagItems : brownBagItems;
		const isCorrectBin = bagItems.includes(this.activeWasteItem.name as WasteItemTexture);

		if (isCorrectBin) {
			if (isBlue) this.blueStreak += 1;
			else this.brownStreak += 1;
			this.updateSuccessfulSort(isBlue);
		} else {
			this.failures += 1;
			this.resetStreaks();
			this.animateBinsDip();
			this.animateFailScoreText();
			this.updateFailures();
		}

		const registryKey = isBlue ? UserBlueBinItems : UserBrownBinItems;
		const registryItems: { [name: string]: number } = this.registry.get(registryKey) || {};
		registryItems[this.activeWasteItem.name] = (registryItems[this.activeWasteItem.name] || 0) + 1;
		this.registry.set(registryKey, registryItems);

		this.totalCount += 1;
		this.registry.set(TotalCount, this.totalCount);
		this.setBinStates();
		this.resetActiveWasteItem();
	}

	updateSuccessfulSort(blue: boolean) {
		this.score += 1;
		const enteredHappyBlueStreak = this.blueStreak === this.happyStreakRequirement && blue;
		const enteredHappyBrownStreak = this.brownStreak === this.happyStreakRequirement && !blue;
		if (enteredHappyBlueStreak || enteredHappyBrownStreak) {
			const randomDetune = Phaser.Math.Between(200, 800);
			this.sound.play("streak", { volume: 0.2, detune: randomDetune });
			this.animateBinJump(enteredHappyBlueStreak ? this.blueBag : this.brownBag);
		}

		this.scoreText.setText(this.score.toString());
		this.animateSuccessScoreText();
	}

	setBinStates() {
		const happyBlueStreak = this.blueStreak >= this.happyStreakRequirement;
		const happyBrownStreak = this.brownStreak >= this.happyStreakRequirement;
		this.blueBag.setTexture(happyBlueStreak ? "blue-happy" : "blue-sad");
		this.brownBag.setTexture(happyBrownStreak ? "brown-happy" : "brown-sad");
		if (happyBrownStreak) this.brownBag.setScale(0.4);
		else this.brownBag.setScale(0.7);
	}

	resetActiveWasteItem() {
		const randomWasteItem = this.getRandomWasteItem();
		this.activeWasteItem.setTexture(randomWasteItem);
		this.activeWasteItem.name = randomWasteItem;
		this.activeWasteItem.x = this.scale.width / 2;
	}

	resetStreaks() {
		this.blueStreak = 0;
		this.brownStreak = 0;
	}

	animateSuccessScoreText() {
		const randomDetune = Phaser.Math.Between(-100, 100);
		this.sound.play("ding", { detune: randomDetune, volume: 0.2 });

		this.tweens.add({
			targets: this.scoreText,
			scale: 1.4,
			duration: 250,
			ease: "Power2",
		});

		this.tweens.add({
			targets: this.scoreText,
			scale: 1,
			duration: 250,
			ease: "Power2",
			delay: 250,
		});
	}

	animateFailScoreText() {
		this.sound.play("failure", { volume: 0.2 });

		// todo: score slowly moves to right and then doesn't tween
		this.tweens.add({
			targets: this.scoreText,
			speed: 500,
			x: this.scoreText.x + 20,
			duration: 80,
			ease: "Linear",
			repeat: 3,
			yoyo: true,
		});
	}

	animateBinJump(bin: Phaser.GameObjects.Sprite) {
		this.tweens.add({
			targets: bin,
			y: bin.y - 100,
			duration: 200,
			ease: "Power2",
		});

		this.tweens.add({
			targets: bin,
			y: bin.y,
			duration: 200,
			ease: "Power2",
			delay: 200,
		});
	}

	animateBinsDip() {
		this.tweens.add({
			targets: this.blueBag,
			y: this.blueBag.y + 50,
			duration: 100,
			ease: "Power2",
		});

		this.tweens.add({
			targets: this.brownBag,
			y: this.brownBag.y + 50,
			duration: 100,
			ease: "Power2",
		});

		this.tweens.add({
			targets: this.blueBag,
			y: this.blueBag.y,
			duration: 200,
			ease: "Power2",
			delay: 100,
		});

		this.tweens.add({
			targets: this.brownBag,
			y: this.brownBag.y,
			duration: 200,
			ease: "Power2",
			delay: 100,
		});
	}

	animateBinRock(bin: Phaser.GameObjects.Sprite) {
		this.tweens.add({
			targets: bin,
			angle: 10,
			duration: 200,
			ease: "Power2",
		});

		this.tweens.add({
			targets: bin,
			angle: -10,
			duration: 200,
			ease: "Power2",
			delay: 200,
		});

		this.tweens.add({
			targets: bin,
			angle: 0,
			duration: 200,
			ease: "Power2",
			delay: 400,
		});
	}

	getRandomWasteItem() {
		return this.wasteItemTextures[Math.floor(Math.random() * this.wasteItemTextures.length)];
	}

	changeEndGameScene() {
		this.scene.switch("GameOver");
	}

	updateFailures() {
		const circleRadius = 15;
		const circleSpacing = 40;
		const totalWidth = (this.maxFailures - 1) * circleSpacing;
		const startX = this.scale.width / 2 - totalWidth / 2;

		for (const circle of this.failureCircles) circle.destroy();
		this.failureCircles = [];

		for (let i = 0; i < this.maxFailures; i++) {
			const circle = this.add.graphics();
			circle.lineStyle(5, 0xffffff);
			circle.fillStyle(this.failures >= i + 1 ? 0xff2465 : 0x666666, 0.7);
			circle.beginPath();
			circle.arc(startX + i * circleSpacing, 150, circleRadius, 0, Math.PI * 2);
			circle.closePath();
			circle.strokePath();
			circle.fill();
			circle.setDepth(100);
			this.failureCircles.push(circle);
		}

		if (this.failures >= this.maxFailures) {
			this.sound.play("game-over", { volume: 0.2, detune: Phaser.Math.Between(-300, 300) });
			this.changeEndGameScene();
		}
	}
}
