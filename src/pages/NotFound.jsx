import React, { useState, useEffect } from 'react';
import DockNav from '../assets/components/DockNav';
import '../assets/stylesheets/not-found.scss';

export default function Page404() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Calcul du décalage par rapport au centre de l'écran (-0.5 à 0.5)
            const x = (e.clientX / window.innerWidth) - 0.5;
            const y = (e.clientY / window.innerHeight) - 0.5;
            setMousePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    return (
        <div className="error-page">

            <main className="error-shell">
                <div className="error-card">
                    <span className="error-kicker">Erreur 404</span>
                    <h1>Ensemble vide</h1>
                    <p>
                        L'élément que vous recherchez n'appartient pas à l'ensemble de ce site. Il a peut-être été déplacé ou n'a pas encore été défini.
                    </p>

                    <div className="math-diagram-container">
                        <svg className="venn-svg" viewBox="0 0 340 220">
                            <defs>
                                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.06"/>
                                </filter>
                            </defs>
                            
                            {/* Bounding box représentant l'ensemble de l'univers */}
                            <rect 
                                x="30" 
                                y="35" 
                                width="280" 
                                height="145" 
                                fill="none" 
                                stroke="rgba(0, 0, 0, 0.08)" 
                                strokeWidth="1.5" 
                                strokeDasharray="4 4"
                                rx="16"
                            />

                            {/* Ensemble E (Ewen's Site) - Cercle de gauche */}
                            <circle 
                                cx="130" 
                                cy="110" 
                                r="58" 
                                fill="rgba(116, 189, 255, 0.12)" 
                                stroke="#007aff" 
                                strokeWidth="1.5"
                                filter="url(#shadow)"
                            />
                            
                            {/* Ensemble R (Ressources) - Cercle de droite */}
                            <circle 
                                cx="210" 
                                cy="110" 
                                r="58" 
                                fill="rgba(255, 175, 92, 0.1)" 
                                stroke="#ff9500" 
                                strokeWidth="1.5"
                                filter="url(#shadow)"
                            />

                            {/* Textes de légendes des ensembles */}
                            <text x="110" y="114" fontFamily="sans-serif" fontSize="12" fontWeight="600" fill="#0056b3" textAnchor="middle">Site</text>
                            <text x="230" y="114" fontFamily="sans-serif" fontSize="12" fontWeight="600" fill="#b36b00" textAnchor="middle">Cours</text>
                            
                            {/* Ω (Espace) - Espacé verticalement des sphères et positionné plus haut */}
                            <text x="170" y="24" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#111" textAnchor="middle">Ω (Site web)</text>

                            {/* Point x (La page demandée) positionné en dehors de l'univers */}
                            <g style={{ 
                                transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
                                transition: 'transform 0.15s ease-out'
                            }}>
                                {/* Cercle extérieur pulsant */}
                                <circle cx="285" cy="195" r="7" fill="rgba(211, 43, 58, 0.2)">
                                    <animate attributeName="r" values="5;9;5" dur="2s" repeatCount="indefinite" />
                                </circle>
                                {/* Point principal */}
                                <circle cx="285" cy="195" r="4.5" fill="#d32b3a" />
                                <text x="298" y="199" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#d32b3a">x ∉ Ω</text>
                            </g>
                        </svg>
                    </div>

                    <div className="btn-group">
                        <button type="button" onClick={goBack} className="apple-btn-primary">
                            <i className="fas fa-chevron-left me-2" style={{ fontSize: '0.8rem', marginRight: '0.5rem' }} /> Retourner
                        </button>
                        <a href="/" className="apple-btn-secondary">
                            <i className="fas fa-home me-2" style={{ marginRight: '0.5rem' }} /> Accueil
                        </a>
                    </div>
                </div>
            </main>

            <DockNav />
        </div>
    );
}