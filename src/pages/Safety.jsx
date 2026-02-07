import React from "react";
import "../assets/stylesheets/index.scss";

const Safety = () => (
	<div className="safety-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f8d7da" }}>
		<h1 style={{ color: "#721c24", marginBottom: "1rem" }}>Site indisponible</h1>
		<p style={{ color: "#721c24", fontSize: "1.2rem", maxWidth: 500, textAlign: "center" }}>
			Afin de garantir ma sécurité personnelle et celle de mon entourage, ce site est temporairement indisponible.<br/><br/>
			Pour toute question, vous pouvez me contacter à <a href="mailto:hello@ewenrdo.fr" style={{ color: "#721c24", textDecoration: "underline" }}>hello@ewenrdo.fr</a>.
		</p>
	</div>
);

export default Safety;
