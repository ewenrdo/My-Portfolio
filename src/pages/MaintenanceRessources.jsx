import React, { useState, useEffect, useRef } from 'react';
import '../assets/stylesheets/maintenance.scss';
import { NavLink } from 'react-router-dom';

export default function MaintenanceRessources() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [vectorCoords, setVectorCoords] = useState({ x: 230, y: 110, angle: 0 });
    const containerRef = useRef(null);

    // Effet parallaxe pour les halos d'arrière-plan
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            setMousePos({ x, y });

            // Calcul de l'orientation du vecteur interactif dans le plan complexe
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const angleRad = Math.atan2(dy, dx);
                
                // Rayon fixe de la grille polaire pour le rendu visuel
                const radius = 65;
                const targetX = 170 + radius * Math.cos(angleRad);
                const targetY = 110 + radius * Math.sin(angleRad);
                
                // Conversion de l'angle en degrés pour l'affichage mathématique
                let angleDeg = Math.round(-angleRad * (180 / Math.PI));
                if (angleDeg < 0) angleDeg += 360;

                setVectorCoords({ x: targetX, y: targetY, angle: angleDeg });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="maintenance-page">
            <style>{`
                .maintenance-page::before {
                    top: -4rem;
                    right: -4rem;
                    width: min(35vw, 30rem);
                    height: min(35vw, 30rem);
                    background: radial-gradient(circle, rgba(255, 175, 92, 0.35) 0%, rgba(255, 175, 92, 0.08) 40%, transparent 70%);
                    transform: translate(${mousePos.x * 20}px, ${mousePos.y * 20}px);
                }

                .maintenance-page::after {
                    left: -5rem;
                    bottom: -2rem;
                    width: min(32vw, 26rem);
                    height: min(32vw, 26rem);
                    background: radial-gradient(circle, rgba(116, 189, 255, 0.3) 0%, rgba(116, 189, 255, 0.06) 40%, transparent 70%);
                    transform: translate(${mousePos.x * -20}px, ${mousePos.y * -20}px);
                }
            `}</style>

            <main className="maintenance-shell" ref={containerRef}>
                <span className="maintenance-kicker">Fermeture estivale</span>
                <h1>Maintenance en cours</h1>
                <p>
                    Mes polycopiés de cours et autres ressources pédagogiques ne sont pas disponibles pendant les vacances universitaires, afin de me permettre de corriger d'éventuelles erreurs et de mettre à jour le contenu.
                </p>

                {/* Plan complexe / Cercle trigonométrique interactif */}
                <div className="math-canvas-container">
                    <svg className="math-svg" viewBox="0 0 340 220">
                        <defs>
                            <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.04"/>
                            </filter>
                        </defs>
                        
                        {/* Axe des abscisses (Réel) */}
                        <line x1="40" y1="110" x2="300" y2="110" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="1" />
                        {/* Axe des ordonnées (Imaginaire) */}
                        <line x1="170" y1="30" x2="170" y2="190" stroke="rgba(0, 0, 0, 0.08)" strokeWidth="1" />
                        
                        {/* Cercle trigonométrique unitaire */}
                        <circle 
                            cx="170" 
                            cy="110" 
                            r="65" 
                            fill="none" 
                            stroke="rgba(0, 0, 0, 0.04)" 
                            strokeWidth="1.5" 
                        />
                        
                        {/* Enveloppe de cadrage en pointillé */}
                        <rect 
                            x="30" 
                            y="20" 
                            width="280" 
                            height="180" 
                            fill="none" 
                            stroke="rgba(0, 0, 0, 0.05)" 
                            strokeWidth="1" 
                            strokeDasharray="4 4"
                            rx="12"
                        />

                        {/* Légendes des axes mathématiques */}
                        <text x="290" y="103" fontFamily="sans-serif" fontSize="10" fontWeight="600" fill="rgba(0,0,0,0.3)" textAnchor="middle">Re</text>
                        <text x="182" y="38" fontFamily="sans-serif" fontSize="10" fontWeight="600" fill="rgba(0,0,0,0.3)" textAnchor="middle">Im</text>

                        {/* Rendu dynamique du vecteur rotatif lié à la souris */}
                        <line 
                            x1="170" 
                            y1="110" 
                            x2={vectorCoords.x} 
                            y2={vectorCoords.y} 
                            stroke="#007aff" 
                            strokeWidth="2" 
                            strokeLinecap="round"
                        />

                        {/* Point d'intersection du vecteur */}
                        <circle 
                            cx={vectorCoords.x} 
                            cy={vectorCoords.y} 
                            r="5" 
                            fill="#007aff" 
                            filter="url(#soft-shadow)"
                        />

                        {/* Affichage de la formule d'Euler en temps réel */}
                        <text 
                            x="170" 
                            y="202" 
                            fontFamily="monospace" 
                            fontSize="11" 
                            fontWeight="600" 
                            fill="rgba(0, 0, 0, 0.6)" 
                            textAnchor="middle"
                        >
                            z = e^(i·{vectorCoords.angle}°)
                        </text>
                        
                        {/* Label d'état système */}
                        <text 
                            x="170" 
                            y="14" 
                            fontFamily="sans-serif" 
                            fontSize="9" 
                            fontWeight="800" 
                            letterSpacing="0.08em" 
                            fill="#ff9500" 
                            textAnchor="middle"
                        >
                            [SYSTEM: IN_PROGRESS]
                        </text>
                    </svg>
                </div>

                <div className="btn-container">
                    <NavLink to="/" className="apple-btn-primary">
                        <i className="fas fa-home" style={{ marginRight: '0.5rem' }} /> Retour à l'accueil
                    </NavLink>
                </div>
            </main>
        </div>
    );
}