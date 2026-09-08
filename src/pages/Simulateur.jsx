import React, { useState, useEffect } from 'react';
import '../assets/stylesheets/simulateur.scss';
import DockNav from '../assets/components/DockNav';

const MATIERES = [
    /*
    {
        key: 'proba',
        label: 'Probabilités Discrètes',
        desc: 'Introduction aux probabilités dans le cas du discret.',
        icon: 'fa-dice'
    },
    {
        key: 'analyse',
        label: 'Analyse-Algèbre',
        desc: 'Étude des espaces euclidiens et séries de fonctions',
        icon: 'fa-calculator'
    },
    {
        key: 'c',
        label: 'Langage C',
        desc: 'Découverte de la programmation bas niveau et de la gestion mémoire.',
        icon: 'fa-code'
    },
    {
        key: 'algo',
        label: "Algorithmique 4",
        desc: 'Complexité et algorithmes de tris et structures binaires.',
        icon: 'fa-project-diagram'
    },
    */
    {
        key: 'algo5',
        label: "Algorithmique 5",
        desc: 'Étude et algorithmique sur les graphes (parcours, chemins, etc.).',
        icon: 'fa-sitemap',
        disabled: false
    },
    {
        key: 'se',
        label: "Système d'Exploitation",
        desc: 'Maîtriser les concepts de bases d\'Unix.',
        icon: 'fa-terminal',
        disabled: true
    },
    {
        key: 'pf',
        label: "Prog. Fonctionnelle",
        desc: 'Bases de la programmation fonctionnelle avec OCaml.',
        icon: 'fa-code-branch',
        disabled: true
    },
    {
        key: 'groupes',
        label: "Groupes et actions",
        desc: 'Notions de la théorie des groupes et des actions de groupe.',
        icon: 'fa-shapes',
        disabled: false
    },
    {
        key: 'diff',
        label: "Calcul Différentiel",
        desc: 'Maîtrise du calcul différentiel en dimension finie, étude locale.',
        icon: 'fa-chart-line',
        disabled: true
    },
    {
        key: 'integ',
        label: "Intégration et Probabilités",
        desc: 'Étude des probabilités continues et liens avec l\'intégration.',
        icon: 'fa-infinity',
        disabled: true
    },
    {
        key: 'anglais',
        label: "Anglais",
        desc: 'Keep calm and stay positive, it won\'t be difficult :)',
        icon: 'fa-language',
        disabled: true
    },
];

export default function Simulateur() {
    // État pour la navigation (si nul, on affiche les grosses cartes)
    const [selectedMatiere, setSelectedMatiere] = useState(null);

    // Chargement initial depuis le localStorage
    const getInitial = (key, def) => {
        try {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : def;
        } catch {
            return def;
        }
    };

    const [groupes, setGroupes] = useState(() => getInitial('simulateur_groupes', { CC1: '', P: '', CC2: '', E: '' }));
    const [algo, setAlgo] = useState(() => getInitial('simulateur_algo', { CC1: '', CC2: '', E: '' }));

    const [results, setResults] = useState({ groupes: null, algo: null });

    // Synchronisation localStorage
    useEffect(() => {
        localStorage.setItem('simulateur_groupes', JSON.stringify(groupes));
    }, [groupes]);

    useEffect(() => {
        localStorage.setItem('simulateur_algo', JSON.stringify(algo));
    }, [algo]);

    // Groupes
    function calcGroupes() {
        const CC1 = parseFloat(groupes.CC1) || 0;
        const P = parseFloat(groupes.P) || 0;
        const CC2 = parseFloat(groupes.CC2) || 0;
        const E = parseFloat(groupes.E) || 0;

        //NF1=(max(C1,E)+max(C2,E))/8+(max(P,E)/4+E/2.

        const NF1 = (Math.max(CC1, E) + Math.max(CC2, E)) / 8 + (Math.max(P, E) / 4 + E / 2);
        setResults(r => ({ ...r, groupes: { NF1: NF1.toFixed(2) } }));
    }

    // Algo
    function calcAlgo() {
        const CC1 = parseFloat(algo.CC1) || 0;
        const CC2 = parseFloat(algo.CC2) || 0;
        const E = parseFloat(algo.E) || 0;

        // NF1 NF = CC1/4 + CC2/4 + E/2 AVANT harmonisation
        const NF1 = CC1 / 4 + CC2 / 4 + E / 2;
        setResults(r => ({ ...r, algo: { NF1: NF1.toFixed(2) } }));
    }

    return (
        <div className="simulateur-page">

            <main className="simulateur-shell">
                <section className="simulateur-shell-copy">
                    <span className="simulateur-kicker">Simulateur de notes</span>
                    <h1>Calculateur de moyenne (MCC)</h1>
                    <p>
                        Simulez vos notes pour les UE de l'année en cours. Les simulateurs sont basés sur les formules données par les responsables d'UE.
                    </p>
                </section>

                {/* ÉCRAN 1 : CHOIX DE LA MATIÈRE */}
                {selectedMatiere === null ? (
                    <div className="subjects-grid">
                        {MATIERES.map((m) => (
                            <button
                                key={m.key}
                                type="button"
                                className={`subject-card ${m.disabled ? 'is-disabled' : ''}`}
                                onClick={() => !m.disabled && setSelectedMatiere(m.key)}
                                disabled={m.disabled}
                            >
                                {m.disabled && <span className="coming-soon-tag">Bientôt</span>}
                                <span className={`subject-icon is-${m.key}`} aria-hidden="true">
                                    <i className={`fas ${m.icon}`} />
                                </span>
                                <div>
                                    <h2 className="subject-title">{m.label}</h2>
                                    <p className="subject-desc">{m.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    /* ÉCRAN 2 : ACCÈS AU SIMULATEUR */
                    <div className="simulator-panel">
                        <header className="simulator-header">
                            <button
                                type="button"
                                className="simulator-back"
                                onClick={() => setSelectedMatiere(null)}
                                aria-label="Retour au choix de la matière"
                            >
                                <i className="fas fa-chevron-left" />
                            </button>
                            <h2 className="simulator-subject-title">
                                {MATIERES.find((m) => m.key === selectedMatiere)?.label}
                            </h2>
                        </header>

                        <div className="simulator-body">

                            {/* FORMULAIRE GROUPES */}
                            {selectedMatiere === 'groupes' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="cc1">Contrôle Continu 1</label>
                                            <input id="cc1" type="number" placeholder="CC1" className="apple-input" value={groupes.CC1} onChange={e => setGroupes({ ...groupes, CC1: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="p">Partiel</label>
                                            <input id="p" type="number" placeholder="P" className="apple-input" value={groupes.P} onChange={e => setGroupes({ ...groupes, P: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="cc2">Contrôle Continu 2</label>
                                            <input id="cc2" type="number" placeholder="CC2" className="apple-input" value={groupes.CC2} onChange={e => setGroupes({ ...groupes, CC2: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="egroupes">Note Examen</label>
                                            <input id="egroupes" type="number" placeholder="E" className="apple-input" value={groupes.E} onChange={e => setGroupes({ ...groupes, E: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="simulator-formula">
                                        <p>Formule de calcul : <b>NF1 = (max(CC1, E) + max(CC2, E)) / 8 + (max(P, E) / 4 + E / 2)</b></p>
                                    </div>

                                    <div className="action-buttons">
                                        <button type="button" onClick={calcGroupes} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.groupes && (
                                        <div className="simulator-results">
                                            <p className="result-text">Note finale calculée (NF1) : <b>{results.groupes.NF1} / 20</b></p>
                                            <NoteProgressBar value={parseFloat(results.groupes.NF1)} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FORMULAIRE ALGO */}
                            {selectedMatiere === 'algo5' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="cc1_algo">Contrôle Continu 1</label>
                                            <input id="cc1_algo" type="number" placeholder="CC1" className="apple-input" value={algo.CC1} onChange={e => setAlgo({ ...algo, CC1: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="cc2_algo">Contrôle Continu 2</label>
                                            <input id="cc2_algo" type="number" placeholder="CC2" className="apple-input" value={algo.CC2} onChange={e => setAlgo({ ...algo, CC2: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="e_algo">Note Examen</label>
                                            <input id="e_algo" type="number" placeholder="E" className="apple-input" value={algo.E} onChange={e => setAlgo({ ...algo, E: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="simulator-formula">
                                        <p>Formule de calcul : <b>NF1 = CC1 / 4 + CC2 / 4 + E / 2</b><br/>
                                        En cas d'absence en CC1 ou CC2, la note diffère :
                                        <ul>
                                            <li>Absence justifiée : CC/3 + 2/3*E</li>
                                            <li>Absence non justifiée : la note du CC est remplacée par 0</li>
                                        </ul>
                                        <b>IMPORTANT : La note calculée ne tient pas compte de l'harmonisation des notes qui aura lieu en fin de semestre.</b>
                                        </p>
                                    </div>

                                    <div className="action-buttons">
                                        <button type="button" onClick={calcAlgo} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.algo && (
                                        <div className="simulator-results">
                                            <p className="result-text">Note finale calculée (NF1) : <b>{results.algo.NF1} / 20</b></p>
                                            <NoteProgressBar value={parseFloat(results.algo.NF1)} />
                                        </div>
                                    )}
                                </div>
                            )}


                            {selectedMatiere !== 'groupes' && selectedMatiere !== 'algo5' && (
                                <div className="simulator-form">
                                    <p className="coming-soon-text">Le simulateur pour cette matière n'est pas encore disponible. Revenez plus tard !</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <DockNav />
            <div className="glow glow-a" aria-hidden="true" />
            <div className="glow glow-b" aria-hidden="true" />
        </div>
    );
}

// Progress bar composant épurée
function NoteProgressBar({ value }) {
    let color = '#d32f2f', label = 'Défaillant';
    if (value >= 16) {
        color = '#34c759'; label = 'Très bien'; // Teinte vert Apple
    } else if (value >= 14) {
        color = '#30b0c7'; label = 'Bien'; // Teinte cyan Apple
    } else if (value >= 12) {
        color = '#007aff'; label = 'Assez bien'; // Teinte bleu Apple
    } else if (value >= 10) {
        color = '#ff9500'; label = 'Validé'; // Teinte orange Apple
    }

    const [showBadge, setShowBadge] = useState(false);

    return (
        <div className="progress-container">
            <div
                className="progress-track"
                onMouseEnter={() => setShowBadge(true)}
                onMouseLeave={() => setShowBadge(false)}
            >
                <div
                    className="progress-fill"
                    style={{
                        width: `${Math.max(0, Math.min(20, value)) * 5}%`,
                        background: color
                    }}
                >
                    {value !== undefined && !isNaN(value) ? `${value} / 20` : ''}
                </div>
            </div>
            {showBadge && (
                <div className="progress-badge">
                    {label}
                </div>
            )}
        </div>
    );
}