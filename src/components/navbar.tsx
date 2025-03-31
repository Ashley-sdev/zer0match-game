import type React from "react";
import styles from "../styles/Navbar.module.css";
import Image from "next/image";
import Language from "./language/Language";

const Navbar: React.FC = () => {
	return (
		<nav
			className={styles.navbar}
			style={{
				backgroundColor: "#000",
				color: "#fff",
				padding: "10px 20px",
				display: "flex",
				flexDirection: "column", // Stack items vertically
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{/* Logo Section */}
			<div
				className={styles.logoContainer}
				style={{
					display: "flex",
					alignItems: "center",
					gap: "10px",
					flexDirection: "column", // Stack logo elements vertically
					marginBottom: "20px", // Add space between logo and language button
				}}
			>
				<div className={styles.logoImages} style={{ marginTop: "1em" }}>
					<Image src="/logo.png" alt="Logo" width={239} height={56} />
				</div>
			</div>

			{/* Language Button Section */}
			<div className={styles.languageButton} style={{ marginTop: "10px" }}>
				<Language />
			</div>
		</nav>
	);
};

export default Navbar;
