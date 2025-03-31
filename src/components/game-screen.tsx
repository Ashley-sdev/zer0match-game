import { useRef } from "react";
import { type IRefPhaserGame, PhaserGame } from "../game/phaser-game";

export default function GameScreen() {
	//  References to the PhaserGame component (game and scene are exposed)
	const phaserRef = useRef<IRefPhaserGame | null>(null);
	if (typeof window === "undefined") {
		return null;
	}

	return (
		<div id="app" className="mt-2.5">
			<PhaserGame ref={phaserRef} />
		</div>
	);
}
