import { EventBus } from "../event-bus";
import { Scene } from "phaser";
import { blueBagItems, brownBagItems, TotalCount, UserBrownBinItems, type WasteItemTexture } from "./swipe-game";
import { UserBlueBinItems } from "./swipe-game";
import { locale } from "../locale";

export class GameOver extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;

	constructor() {
		super("GameOver");
	}

	create() {
		this.camera = this.cameras.main;
		this.camera.setBackgroundColor(0x000000);
		this.background = this.add.image(512, 384, "background");
		this.background.setAlpha(0.5);

		const blueBinItems = this.registry.get(UserBlueBinItems) as { [name: string]: number };
		const brownBinItems = this.registry.get(UserBrownBinItems) as { [name: string]: number };
		const incorrectBlueBinItems = Object.entries(blueBinItems).filter(
			([key]) => !blueBagItems.includes(key as WasteItemTexture),
		);
		const incorrectBrownBinItems = Object.entries(brownBinItems).filter(
			([key]) => !brownBagItems.includes(key as WasteItemTexture),
		);

		const incrorrectBlueItemCount = incorrectBlueBinItems.reduce((acc, [_, value]) => acc + value, 0);
		const incrorrectBrownItemCount = incorrectBrownBinItems.reduce((acc, [_, value]) => acc + value, 0);
		const totalIncorrectItemCount = incrorrectBlueItemCount + incrorrectBrownItemCount;
		const totalAttemptCount = this.registry.get(TotalCount) as number;
		const totalCorrectItemCount = totalAttemptCount - totalIncorrectItemCount;

		const scoreText = this.add.text(this.scale.width * 0.7, 200, totalCorrectItemCount.toString(), {
			fontSize: 120,
			color: "#ffffff",
			fontFamily: "Space Grotesk",
			fontStyle: "bold",
		});

		scoreText.setDepth(100);
		scoreText.setOrigin(0.5, 0.5);

		const scoreStar = this.add.star(scoreText.x, scoreText.y, 6, 20, 46, 0xebc034);
		scoreStar.setScale(1.3);
		this.tweens.add({
			targets: scoreStar,
			angle: 360,
			duration: 8000,
			repeat: -1,
			ease: "Linear",
		});

		const goodCorrectAmount = totalAttemptCount >= 30;
		const headerSentiment = goodCorrectAmount ? "Thank\nyou!" : "Oops!";
		const headerText = this.add.text(this.scale.width * 0.3, 200, headerSentiment, {
			fontSize: 80,
			color: "#ffffff",
			fontFamily: "Space Grotesk",
			fontStyle: "bold",
		});
		headerText.setOrigin(0.5, 0.5);

		const pluralItem = totalCorrectItemCount === 1 ? "item" : "items";
		const subMessage = goodCorrectAmount
			? `You correctly sorted\n${totalCorrectItemCount} ${pluralItem} in the bins.`
			: `You only managed to\nsort ${totalCorrectItemCount} ${pluralItem} into\nthe bins.`;
		const subText = this.add.text(this.scale.width * 0.45, headerText.y + headerText.height + 30, subMessage, {
			fontSize: 40,
			color: "#ffffff",
			fontFamily: "Space Grotesk",
		});
		subText.setOrigin(0.5, 0.5);

		const panelGraphics = this.add.graphics();
		const panelX = this.scale.width * 0.06;
		const panelY = this.scale.height * 0.65;
		const panelWidth = 480;
		const panelHeight = 150;
		panelGraphics.fillStyle(0xffffff, 1);
		panelGraphics.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 32);

		const problemItem = incorrectBlueBinItems.concat(incorrectBrownBinItems).sort((a, b) => b[1] - a[1])[0];
		const itemTip = locale.itemTips[problemItem?.[0] as keyof typeof locale.itemTips];
		const tooltipText = this.add.text(panelX + panelWidth / 2, panelY + panelHeight / 2, itemTip, {
			fontSize: 30,
			color: "#000000",
			fontFamily: "Space Grotesk",
			wordWrap: { width: 400, useAdvancedWrap: true },
		});
		tooltipText.setOrigin(0.5, 0.5);

		const problemItemSprite = this.add.sprite(panelX + 20, panelY - 20, problemItem?.[0]);
		problemItemSprite.setOrigin(0.5, 0.5);
		problemItemSprite.setScale(0.3);

		const recycleMorePanel = this.add.graphics();
		const recycleMorePanelX = panelX;
		const recycleMorePanelY = panelY + panelHeight + 30;
		recycleMorePanel.fillStyle(0xffffff, 1);
		recycleMorePanel.fillRoundedRect(recycleMorePanelX, recycleMorePanelY, panelWidth / 2 - 10, panelHeight / 2, 32);
		const recycleMorePanelShape = new Phaser.Geom.Rectangle(
			recycleMorePanelX,
			recycleMorePanelY,
			panelWidth / 2,
			panelHeight / 2,
		);

		recycleMorePanel.setInteractive({
			useHandCursor: true,
			hitArea: recycleMorePanelShape,
			hitAreaCallback: Phaser.Geom.Rectangle.Contains,
		});

		recycleMorePanel.on("pointerdown", () => {
			this.registry.reset();
			this.scene.switch("SwipeGame");
		});

		const recycleMoreText = this.add.text(
			recycleMorePanelX + panelWidth / 4,
			recycleMorePanelY + panelHeight / 4,
			"Try Again",
			{
				fontSize: 30,
				color: "#000000",
				fontFamily: "Space Grotesk",
			},
		);
		recycleMoreText.setOrigin(0.5, 0.5);

		const moreInfoPanel = this.add.graphics();
		const moreInfoPanelX = recycleMorePanelX + panelWidth / 2 + 10;
		const moreInfoPanelY = recycleMorePanelY;
		moreInfoPanel.fillStyle(0xffffff, 1);
		moreInfoPanel.fillRoundedRect(moreInfoPanelX, moreInfoPanelY, panelWidth / 2 - 10, panelHeight / 2, 32);
		const moreInfoPanelShape = new Phaser.Geom.Rectangle(
			moreInfoPanelX,
			moreInfoPanelY,
			panelWidth / 2,
			panelHeight / 2,
		);

		moreInfoPanel.setInteractive({
			useHandCursor: true,
			hitArea: moreInfoPanelShape,
			hitAreaCallback: Phaser.Geom.Rectangle.Contains,
		});

		moreInfoPanel.on("pointerdown", () => {
			window.open("https://www.fostplus.be/en/sorting/sorting-home#pmdsorting", "_blank");
		});

		const moreInfoText = this.add.text(moreInfoPanelX + panelWidth / 4, moreInfoPanelY + panelHeight / 4, "More Info", {
			fontSize: 30,
			color: "#000000",
			fontFamily: "Space Grotesk",
		});
		moreInfoText.setOrigin(0.5, 0.5);

		EventBus.emit("current-scene-ready", this);

		this.events.on("wake", () => {
			this.children.removeAll();
			this.create();
		});
	}
}
