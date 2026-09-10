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
        disabled: false
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
        disabled: false
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
    const [progFonct, setProgFonct] = useState(() => getInitial('simulateur_progFonct', { P: '', E: '' }));
    const [proba, setProba] = useState(() => getInitial('simulateur_proba', { CC1: '', P: '', CC2: '', E: '' }));
    const [calculDiff, setCalculDiff] = useState(() => getInitial('simulateur_calculDiff', { CC1: '', CC2: '', CC3: '', E: '' }));
    const [results, setResults] = useState({ groupes: null, algo: null, progFonct: null, calculDiff: null });

    // Synchronisation localStorage
    useEffect(() => {
        localStorage.setItem('simulateur_groupes', JSON.stringify(groupes));
    }, [groupes]);

    useEffect(() => {
        localStorage.setItem('simulateur_algo', JSON.stringify(algo));
    }, [algo]);

    useEffect(() => {
        localStorage.setItem('simulateur_progFonct', JSON.stringify(progFonct));
    }, [progFonct]);

    useEffect(() => {
        localStorage.setItem('simulateur_proba', JSON.stringify(proba));
    }, [proba]);

    useEffect(() => {
        localStorage.setItem('simulateur_calculDiff', JSON.stringify(calculDiff));
    }, [calculDiff]);

    // Programmation fonctionnelle (max(1/3 2/3, 1))
    function calcProgFonct() {
        const P = parseFloat(progFonct.P) || 0;
        const E = parseFloat(progFonct.E) || 0;

        // NF1 = max(P/3 + 2/3*E, E)
        const NF1 = Math.max(P / 3 + (2 / 3) * E, E);
        setResults(r => ({ ...r, progFonct: { NF1: NF1.toFixed(2) } }));
    }

    // Intégration et Probabilités 
    function calcProba() {
        const CC1 = parseFloat(proba.CC1) || 0;
        const P = parseFloat(proba.P) || 0;
        const CC2 = parseFloat(proba.CC2) || 0;
        const E = parseFloat(proba.E) || 0;

        // NF1 = 1/8(max(CC1,E)+2max(P,E)+max(CC2,E)+4E)
        const NF1 = (Math.max(CC1, E) + 2 * Math.max(P, E) + Math.max(CC2, E) + 4 * E) / 8;
        setResults(r => ({ ...r, proba: { NF1: NF1.toFixed(2) } }));
    }

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

    function calcCalculDiff() {
        const CC1 = parseFloat(calculDiff.CC1) || 0;
        const CC2 = parseFloat(calculDiff.CC2) || 0;
        const CC3 = parseFloat(calculDiff.CC3) || 0;
        const E = parseFloat(calculDiff.E) || 0;

        // NF1 = 1/2(E + 1/3 * (max(E, CC1) + max(E, CC2) + max(E, CC3)))
        const NF1 = 1/2 * (E + 1/3 * (Math.max(E, CC1) + Math.max(E, CC2) + Math.max(E, CC3)));
        setResults(r => ({ ...r, calculDiff: { NF1: NF1.toFixed(2) } }));
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

                            {selectedMatiere === 'pf' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="p_pf">Partiel</label>
                                            <input id="p_pf" type="number" placeholder="P" className="apple-input" value={progFonct.P} onChange={e => setProgFonct({ ...progFonct, P: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="e_pf">Note Examen</label>
                                            <input id="e_pf" type="number" placeholder="E" className="apple-input" value={progFonct.E} onChange={e => setProgFonct({ ...progFonct, E: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="simulator-formula">
                                        <p>Formule de calcul : <b>NF1 = max(P / 3 + 2 / 3 * E, E)</b></p>
                                    </div>

                                    <div className="action-buttons">
                                        <button type="button" onClick={calcProgFonct} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.progFonct && (
                                        <div className="simulator-results">
                                            <p className="result-text">Note finale calculée (NF1) : <b>{results.progFonct.NF1} / 20</b></p>
                                            <NoteProgressBar value={parseFloat(results.progFonct.NF1)} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedMatiere === 'proba' && (
                                <div className="simulator-form">
                                    <div className="input-group">
                                        <label htmlFor="cc1_p">CC1</label>
                                        <input id="cc1_p" type="number" placeholder="CC1" className="apple-input" value={proba.CC1} onChange={e => setProba({ ...proba, CC1: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="p_p">Partiel</label>
                                        <input id="p_p" type="number" placeholder="P" className="apple-input" value={proba.P} onChange={e => setProba({ ...proba, P: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="cc2_p">CC2</label>
                                        <input id="cc2_p" type="number" placeholder="CC2" className="apple-input" value={proba.CC2} onChange={e => setProba({ ...proba, CC2: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="e_p">Note Examen</label>
                                        <input id="e_p" type="number" placeholder="E" className="apple-input" value={proba.E} onChange={e => setProba({ ...proba, E: e.target.value })} />
                                    </div>
                                    <div className="simulator-formula">
                                        <p>Formule de calcul : <b>NF1 = (max(CC1,E) + 2 * max(P,E) + max(CC2,E) + 4 * E) / 8</b><br/>
                                        Dates des épreuves :
                                        <ul>
                                            <li>CC1 : 7 octobre 2026 - 1h</li>
                                            <li>P : 7 novembre 2026 à 9h30 - 2h</li>
                                            <li>CC2 : début décembre 2026 (après le 2 décembre) - 1h</li>
                                            <li>E : début janvier 2027 - 1h</li>
                                        </ul>
                                        </p>
                                    </div>

                                    <div className="action-buttons">
                                        <button type="button" onClick={calcProba} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.proba && (
                                        <div className="simulator-results">
                                            <p className="result-text">Note finale calculée (NF1) : <b>{results.proba.NF1} / 20</b></p>
                                            <NoteProgressBar value={parseFloat(results.proba.NF1)} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedMatiere === 'diff' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="cc1_diff">Contrôle Continu 1</label>
                                            <input id="cc1_diff" type="number" placeholder="CC1" className="apple-input" value={calculDiff.CC1} onChange={e => setCalculDiff({ ...calculDiff, CC1: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="cc2_diff">Contrôle Continu 2</label>
                                            <input id="cc2_diff" type="number" placeholder="CC2" className="apple-input" value={calculDiff.CC2} onChange={e => setCalculDiff({ ...calculDiff, CC2: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="cc3_diff">Contrôle Continu 3</label>
                                            <input id="cc3_diff" type="number" placeholder="CC3" className="apple-input" value={calculDiff.CC3} onChange={e => setCalculDiff({ ...calculDiff, CC3: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="e_diff">Note Examen</label>
                                            <input id="e_diff" type="number" placeholder="E" className="apple-input" value={calculDiff.E} onChange={e => setCalculDiff({ ...calculDiff, E: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="simulator-formula">
                                        <p>Formule de calcul : <b>NF1 = 1/2(E + 1/3 * (max(E, CC1) + max(E, CC2) + max(E, CC3)))</b></p>
                                    </div>

                                    <div className="action-buttons">
                                        <button type="button" onClick={calcCalculDiff} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.calculDiff && (
                                        <div className="simulator-results">
                                            <p className="result-text">Note finale calculée (NF1) : <b>{results.calculDiff.NF1} / 20</b></p>
                                            <NoteProgressBar value={parseFloat(results.calculDiff.NF1)} />
                                        </div>
                                    )}
                                </div>
                            )}


                            {selectedMatiere !== 'groupes' && selectedMatiere !== 'algo5' && selectedMatiere !== 'pf' && selectedMatiere !== 'proba' && selectedMatiere !== 'diff' && (
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