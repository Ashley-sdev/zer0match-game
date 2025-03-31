import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import type React from "react";
import nextI18NextConfig from "../../next-i18next.config.js";
import { ClientGame } from "../components/client-game";
import Nav from "../components/navbar";
import styles from "../styles/Navbar.module.css";

const Index: React.FC = () => {
	const { t } = useTranslation("common");

	return (
		<>
			<Nav />

			{/* Intro Section */}
			<section className={styles.introSection}>
				<h1 className={styles.introTitle}>{t("index.welkom")}</h1>
				<p className={styles.introText}>{t("index.inleidendetekst")}</p>
			</section>

			{/* Game Section */}
			<section className={styles.gameSection}>
				<h2 className={styles.gameTitle}>Zer0Match</h2>
				<div className={styles.gameContent}>
					<ClientGame />
					<div className={styles.gameDescription}>
						<h2>{t("index.sort")}</h2>
						<p>{t("index.trips")}</p>
					</div>
				</div>
			</section>

			{/* Sorting Guide Section */}
			<section className={styles.sortingGuide} style={{ padding: "80px 40px" }}>
				<h2 className={styles.sortingTitle} style={{ marginBottom: "60px" }}>
					{t("index.plan")}
				</h2>
				{[
					{
						src: "/plastic.png",
						alt: "Plastic verpakkingen",
						title: t("index.plastic"),
						items: [
							t("index.flessen"),
							t("index.schaaltjes"),
							t("index.potjes"),
							t("index.folies"),
							t("index.drankcapsules"),
						],
					},
					{
						src: "/metalen.png",
						alt: "Metalen verpakkingen",
						title: t("index.metalen"),
						items: [
							t("index.drankblikken"),
							t("index.spuitbussen"),
							t("index.aluminium"),
							t("index.deksels"),
							t("index.drankcapsules"),
						],
					},
					{
						src: "/drankkarton.png",
						alt: "Drankkartons",
						title: t("index.drankkarton"),
						items: [t("index.melk_fruitsap"), t("index.soep_room")],
					},
				].map((category, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className={styles.sortingItem}
						style={{ padding: "30px", textAlign: "center", maxWidth: "350px" }}
					>
						<Image
							src={category.src}
							alt={category.alt}
							width={250}
							height={180}
							className={`${styles.responsiveImage} ${styles.imagePadding}`}
							style={{ marginBottom: "30px" }}
						/>
						<h3 style={{ marginBottom: "20px" }}>{category.title}</h3>
						<ul style={{ textAlign: "left", paddingLeft: "30px", lineHeight: "2" }}>
							{category.items.map((item, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								<li key={i} style={{ marginBottom: "15px" }}>
									{item}
								</li>
							))}
						</ul>
					</div>
				))}
			</section>

			{/* Incorrect Sorting */}
			<section className={styles.incorrectSorting}>
				<h2 className={styles.incorrectTitle}>❌ {t("index.incorrectSortingTitle")}</h2>
				<div className={styles.incorrectItems}>
					{[
						{ src: "/batterij.png", alt: "Batterijen", text: t("index.batterijen") },
						{ src: "/gasflessen.png", alt: "Gascartouches", text: t("index.gascartouches") },
						{ src: "/kinddop.png", alt: "Kindveilige dop", text: t("index.kindveilige_dop") },
						{ src: "/grootvolume.png", alt: "Grote verpakkingen", text: t("index.grote_verpakkingen") },
						{ src: "/piepschuim.png", alt: "Piepschuim", text: t("index.piepschuim") },
						{ src: "/andere.png", alt: "Andere voorwerpen", text: t("index.andere_voorwerpen") },
						{ src: "/gevaar.png", alt: "Gevaarlijke verpakkingen", text: t("index.gevaarlijke_verpakkingen") },
						{ src: "/auto.png", alt: "Olie en chemicaliën", text: t("index.olie_chemicalien") },
					].map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={index} className={styles.incorrectItem}>
							<Image
								src={item.src}
								alt={item.alt}
								width={250}
								height={180}
								className={`${styles.responsiveImage} ${styles.imagePadding}`}
							/>
							<span>{item.text}</span>
						</div>
					))}
				</div>
			</section>

			{/* Recycling Rules Section */}
			<section
				style={{
					padding: "60px",
					textAlign: "center",
					backgroundColor: "#000",
					color: "#fff",
					borderRadius: "10px",
					margin: "20px",
					boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div style={{ maxWidth: "800px", width: "100%" }}>
					<h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "40px" }}>{t("index.rules")}</h2>
					<ul style={{ textAlign: "left", lineHeight: "1.8", fontSize: "18px", padding: "0 20px" }}>
						<li>{t("index.flessen_goed_leeg")}</li>
						<li>{t("index.duw_plastic_flessen")}</li>
						<li>{t("index.verwijder_plastic_folie")}</li>
						<li>{t("index.trek_folies")}</li>
						<li>{t("index.niets_in_elkaar")}</li>
						<li>{t("index.geen_gevulde_zakjes")}</li>
						<li>{t("index.niets_vastmaken")}</li>
					</ul>
				</div>
				<div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
					<Image
						src="/Regels-PMD.png"
						alt="Recycling Rules"
						width={600}
						height={400}
						style={{ maxWidth: "100%", height: "auto" }}
					/>
				</div>
			</section>
		</>
	);
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ["common", "footer"], nextI18NextConfig)),
	},
});

export default Index;
