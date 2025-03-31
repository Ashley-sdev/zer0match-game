"use client";
import dynamic from "next/dynamic";

export const ClientGame = dynamic(() => import("./game-screen").then((mod) => mod.default), {
	ssr: false,
});
