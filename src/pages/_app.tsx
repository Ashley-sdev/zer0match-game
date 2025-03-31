"use client";

import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React from "react";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
	weight: ["400", "700"],
	subsets: ["latin"],
});

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<main className={spaceGrotesk.className}>
			<Component {...pageProps} />
		</main>
	);
};

export default dynamic(() => Promise.resolve(appWithTranslation(App)), {
	ssr: false,
});
