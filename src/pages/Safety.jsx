import React, { useState, useEffect, useRef } from 'react';
import '../assets/stylesheets/safety.scss';

export default function Safety() {
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [cryptoState, setCryptoState] = useState({ key: '0x0000', hash: 0, activeDot: 0 });
	const containerRef = useRef(null);

	// Effet parallaxe pour les halos d'arrière-plan et calculs cryptographiques
	useEffect(() => {
		const handleMouseMove = (e) => {
			const x = (e.clientX / window.innerWidth) - 0.5;
			const y = (e.clientY / window.innerHeight) - 0.5;
			setMousePos({ x, y });

			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const centerX = rect.left + rect.width / 2;
				const centerY = rect.top + rect.height / 2;

				const dx = e.clientX - centerX;
				const dy = e.clientY - centerY;

				// Calcul de la distance euclidienne par rapport au centre du cadran
				const distance = Math.sqrt(dx * dx + dy * dy);

				// Génération d'une fausse clé de hachage hexadécimale basée sur la position
				const hexKey = '0x' + Math.abs(Math.round(distance * 12.34)).toString(16).toUpperCase().padStart(4, '0');

				// Calcul d'une congruence modulaire d'intégrité : x ≡ distance mod 256
				const modValue = Math.round(distance) % 256;

				// Sélection d'un point actif sur le cercle de chiffrement (0 à 7)
				const angleRad = Math.atan2(dy, dx);
				let sector = Math.round(((angleRad + Math.PI) / (2 * Math.PI)) * 8) % 8;

				setCryptoState({ key: hexKey, hash: modValue, activeDot: sector });
			}
		};

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	return (
		<div className="safety-page">
			<style>{`
                .safety-page::before {
                    top: -4rem;
                    right: -4rem;
                    width: min(35vw, 30rem);
                    height: min(35vw, 30rem);
                    background: radial-gradient(circle, rgba(255, 74, 74, 0.28) 0%, rgba(255, 74, 74, 0.06) 40%, transparent 70%);
                    transform: translate(${mousePos.x * 15}px, ${mousePos.y * 15}px);
                }

                .safety-page::after {
                    left: -5rem;
                    bottom: -2rem;
                    width: min(32vw, 26rem);
                    height: min(32vw, 26rem);
                    background: radial-gradient(circle, rgba(255, 149, 0, 0.22) 0%, rgba(255, 149, 0, 0.05) 40%, transparent 70%);
                    transform: translate(${mousePos.x * -15}px, ${mousePos.y * -15}px);
                }
            `}</style>

			<main className="safety-shell" ref={containerRef}>
				<span className="safety-kicker">Protocole de sécurité</span>
				<h1>Accès restreint</h1>
				<p>
					Ce site a été temporairement désactivé pour des raisons de sécurité ou de maintenance critique. Veuillez m'excuser pour ce désagrément.
				</p>

				{/* Cadran d'intégrité et de cryptographie modulaire */}
				<div className="crypto-canvas-container">
					<svg className="crypto-svg" viewBox="0 0 340 220">
						<defs>
							<filter id="soft-red-shadow" x="-20%" y="-20%" width="140%" height="140%">
								<feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#ff3b30" floodOpacity="0.12" />
							</filter>
						</defs>

						{/* Axe polaire / Grille de chiffrement */}
						<line x1="40" y1="110" x2="300" y2="110" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />
						<line x1="170" y1="30" x2="170" y2="190" stroke="rgba(0, 0, 0, 0.05)" strokeWidth="1" />

						{/* Cercles de chiffrement concentriques */}
						<circle cx="170" cy="110" r="55" fill="none" stroke="rgba(255, 59, 48, 0.08)" strokeWidth="1.5" />
						<circle cx="170" cy="110" r="30" fill="none" stroke="rgba(0, 0, 0, 0.03)" strokeWidth="1" />

						{/* Boîte d'isolation externe en pointillé */}
						<rect
							x="30"
							y="20"
							width="280"
							height="180"
							fill="none"
							stroke="rgba(255, 59, 48, 0.15)"
							strokeWidth="1.2"
							strokeDasharray="4 4"
							rx="12"
						/>

						{/* Indicateurs clés du cadran de sécurité */}
						{Array.from({ length: 8 }).map((_, i) => {
							const angle = (i * Math.PI) / 4;
							const cx = 170 + 55 * Math.cos(angle);
							const cy = 110 + 55 * Math.sin(angle);
							const isActive = cryptoState.activeDot === i;
							return (
								<circle
									key={i}
									cx={cx}
									cy={cy}
									r={isActive ? "4.5" : "2.5"}
									fill={isActive ? "#ff3b30" : "rgba(0, 0, 0, 0.15)"}
									style={{ transition: 'all 0.1s ease' }}
								/>
							);
						})}

						{/* Symbole du cadenas stylisé au centre */}
						<g transform="translate(160, 100)">
							<rect x="3" y="8" width="14" height="11" rx="2" fill="none" stroke="#ff3b30" strokeWidth="1.5" />
							<path d="M6,8 V5 A4,4 0 0,1 14,5 V8" fill="none" stroke="#ff3b30" strokeWidth="1.5" />
						</g>

						{/* Affichage des états de chiffrement en temps réel */}
						<text
							x="170"
							y="202"
							fontFamily="monospace"
							fontSize="11"
							fontWeight="600"
							fill="rgba(0, 0, 0, 0.6)"
							textAnchor="middle"
						>
							Key: {cryptoState.key} • Integrity ≡ {cryptoState.hash} (mod 256)
						</text>

						{/* Label d'alerte */}
						<text
							x="170"
							y="14"
							fontFamily="sans-serif"
							fontSize="9"
							fontWeight="800"
							letterSpacing="0.08em"
							fill="#ff3b30"
							textAnchor="middle"
						>
							[SECURITY: ACCESS_RESTRICTED]
						</text>
					</svg>
				</div>

				<div className="btn-container">
					<a href="mailto:contact@ewenrdo.fr" className="apple-btn-primary">
						<i className="fas fa-envelope" style={{ marginRight: '0.5rem' }} /> Me contacter
					</a>
					<a href="/" className="apple-btn-secondary">
						Retour à l'accueil
					</a>
				</div>
			</main>
		</div>
	);
}