import React, { useState, useEffect } from 'react';
import NavBar from '../assets/components/NavBar';
import '../assets/stylesheets/simulateur.scss';
import DockNav from '../assets/components/DockNav';

const MATIERES = [
    {
        key: 'proba',
        label: 'Probabilités',
        desc: 'Calcul fondé sur 3 interros et l\'examen final avec formule d\'optimisation.',
        icon: 'fa-dice'
    },
    {
        key: 'analyse',
        label: 'Analyse-Algèbre',
        desc: 'Évaluation combinant 2 CC, un examen partiel et un examen final.',
        icon: 'fa-calculator'
    },
    {
        key: 'c',
        label: 'Langage C',
        desc: 'Contrôle continu sur table, projet d\'application et épreuve sur ordinateur.',
        icon: 'fa-code'
    },
    {
        key: 'algo',
        label: "Algorithmique",
        desc: 'Barème complet : 2 CC, un projet, une note d\'assiduité et examen final.',
        icon: 'fa-project-diagram'
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

    const [prob, setProb] = useState(() => getInitial('simulateur_prob', { I1: '', I2: '', I3: '', E: '' }));
    const [analyse, setAnalyse] = useState(() => getInitial('simulateur_analyse', { CC1: '', CC2: '', P: '', E1: '' }));
    const [c, setC] = useState(() => getInitial('simulateur_c', { CC: '', P: '', E: '' }));
    const [algo, setAlgo] = useState(() => getInitial('simulateur_algo', { CC1: '', CC2: '', Partiel: '', Assiduite: '', Examen: '' }));
    const [results, setResults] = useState({ prob: null, analyse: null, c: null, algo: null });

    // Synchronisation localStorage
    useEffect(() => {
        localStorage.setItem('simulateur_algo', JSON.stringify(algo));
    }, [algo]);
    useEffect(() => {
        localStorage.setItem('simulateur_prob', JSON.stringify(prob));
    }, [prob]);
    useEffect(() => {
        localStorage.setItem('simulateur_analyse', JSON.stringify(analyse));
    }, [analyse]);
    useEffect(() => {
        localStorage.setItem('simulateur_c', JSON.stringify(c));
    }, [c]);

    // Algorithmique
    function calcAlgo() {
        const CC1 = parseFloat(algo.CC1) || 0;
        const CC2 = parseFloat(algo.CC2) || 0;
        const Partiel = parseFloat(algo.Partiel) || 0;
        const Assiduite = parseFloat(algo.Assiduite) || 0;
        const Examen = algo.Examen === '' ? null : parseFloat(algo.Examen);
        let note, neededExamen = null;
        if (Examen === null) {
            neededExamen = (10 - 0.1 * CC1 - 0.1 * CC2 - 0.2 * Partiel - 0.1 * Assiduite) / 0.5;
            setResults(r => ({ ...r, algo: { note: '', neededExamen: neededExamen.toFixed(2) } }));
        } else {
            note = 0.1 * CC1 + 0.1 * CC2 + 0.2 * Partiel + 0.1 * Assiduite + 0.5 * Examen;
            setResults(r => ({ ...r, algo: { note: note.toFixed(2), neededExamen: null } }));
        }
    }

    // Langage C
    function calcC() {
        const CC = parseFloat(c.CC) || 0;
        const P = parseFloat(c.P) || 0;
        const E = c.E === '' ? null : parseFloat(c.E);
        let note, neededE = null;
        if (E === null) {
            neededE = (10 - 0.1 * CC - 0.4 * P) / 0.5;
            setResults(r => ({ ...r, c: { note: '', neededE: neededE.toFixed(2) } }));
        } else {
            note = 0.1 * CC + 0.4 * P + 0.5 * E;
            setResults(r => ({ ...r, c: { note: note.toFixed(2), neededE: null } }));
        }
    }

    // Probabilités
    function calcProb() {
        const I1 = parseFloat(prob.I1) || 0;
        const I2 = parseFloat(prob.I2) || 0;
        const I3 = parseFloat(prob.I3) || 0;
        const E = prob.E === '' ? null : parseFloat(prob.E);
        let I, NF, neededE = null;
        if (E === null) {
            let left = 0, right = 20, mid;
            for (let iter = 0; iter < 30; ++iter) {
                mid = (left + right) / 2;
                const i = (1 / 3) * (Math.max(I1, mid) + Math.max(I2, mid) + Math.max(I3, mid));
                const nf = Math.max(mid, (mid + i) / 2);
                if (nf >= 10) {
                    right = mid;
                } else {
                    left = mid;
                }
            }
            neededE = right;
            setResults(r => ({ ...r, prob: { I: '', NF: '', neededE: neededE !== null ? neededE.toFixed(2) : null } }));
        } else {
            I = (1 / 3) * (Math.max(I1, E) + Math.max(I2, E) + Math.max(I3, E));
            NF = Math.max(E, (E + I) / 2);
            setResults(r => ({ ...r, prob: { I: I.toFixed(2), NF: NF.toFixed(2), neededE: null } }));
        }
    }

    // Analyse-Algèbre
    function calcAnalyse() {
        const CC1 = parseFloat(analyse.CC1) || 0;
        const CC2 = parseFloat(analyse.CC2) || 0;
        const P = parseFloat(analyse.P) || 0;
        const E1 = analyse.E1 === '' ? null : parseFloat(analyse.E1);
        let CC, NS1, neededE1 = null;
        if (E1 === null) {
            let left = 0, right = 20, mid;
            for (let iter = 0; iter < 30; ++iter) {
                mid = (left + right) / 2;
                const cc = (Math.max(CC1, mid) + 2 * Math.max(P, mid) + Math.max(CC2, mid)) / 4;
                const ns1 = (mid + cc) / 2;
                if (ns1 >= 10) {
                    right = mid;
                } else {
                    left = mid;
                }
            }
            neededE1 = right;
            setResults(r => ({ ...r, analyse: { CC: '', NS1: '', neededE1: neededE1.toFixed(2) } }));
        } else {
            CC = (Math.max(CC1, E1) + 2 * Math.max(P, E1) + Math.max(CC2, E1)) / 4;
            NS1 = (E1 + CC) / 2;
            setResults(r => ({ ...r, analyse: { CC: CC.toFixed(2), NS1: NS1.toFixed(2), neededE1: null } }));
        }
    }

    return (
        <div className="simulateur-page">

            <main className="simulateur-shell">
                <section className="simulateur-shell-copy">
                    <span className="simulateur-kicker">Simulateur de notes</span>
                    <h1>Calculateur de moyenne (MCC)</h1>
                    <p>
                        Renseignez vos notes intermédiaires pour évaluer votre moyenne ou simuler l&apos;exigence minimale requise pour valider l&apos;UE.
                    </p>
                </section>

                {/* ÉCRAN 1 : CHOIX DE LA MATIÈRE */}
                {selectedMatiere === null ? (
                    <div className="subjects-grid">
                        {MATIERES.map((m) => (
                            <button
                                key={m.key}
                                type="button"
                                className="subject-card"
                                onClick={() => setSelectedMatiere(m.key)}
                            >
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
                            {/* FORMULAIRE PROBABILITÉS */}
                            {selectedMatiere === 'proba' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="i1">Interro 1</label>
                                            <input id="i1" type="number" placeholder="I1" className="apple-input" value={prob.I1} onChange={e => setProb({ ...prob, I1: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="i2">Interro 2</label>
                                            <input id="i2" type="number" placeholder="I2" className="apple-input" value={prob.I2} onChange={e => setProb({ ...prob, I2: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="i3">Interro 3</label>
                                            <input id="i3" type="number" placeholder="I3" className="apple-input" value={prob.I3} onChange={e => setProb({ ...prob, I3: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="eprob">Note Examen</label>
                                            <input id="eprob" type="number" placeholder="Laissez vide pour simuler" className="apple-input" value={prob.E} onChange={e => setProb({ ...prob, E: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <button type="button" onClick={calcProb} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.prob && (
                                        <div className="simulator-results">
                                            {results.prob.neededE ? (
                                                <p className="result-text">Note minimale nécessaire au partiel pour valider : <b>{results.prob.neededE} / 20</b></p>
                                            ) : (
                                                <>
                                                    <p className="result-text">Note moyenne calculée d'interros (I) : <b>{results.prob.I} / 20</b></p>
                                                    <NoteProgressBar value={parseFloat(results.prob.NF)} />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FORMULAIRE ANALYSE-ALGÈBRE */}
                            {selectedMatiere === 'analyse' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="cc1">Note CC 1</label>
                                            <input id="cc1" type="number" placeholder="CC1" className="apple-input" value={analyse.CC1} onChange={e => setAnalyse({ ...analyse, CC1: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="cc2">Note CC 2</label>
                                            <input id="cc2" type="number" placeholder="CC2" className="apple-input" value={analyse.CC2} onChange={e => setAnalyse({ ...analyse, CC2: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="p">Examen Partiel</label>
                                            <input id="p" type="number" placeholder="P" className="apple-input" value={analyse.P} onChange={e => setAnalyse({ ...analyse, P: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="e1">Examen Final</label>
                                            <input id="e1" type="number" placeholder="Laissez vide pour simuler" className="apple-input" value={analyse.E1} onChange={e => setAnalyse({ ...analyse, E1: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <button type="button" onClick={calcAnalyse} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.analyse && (
                                        <div className="simulator-results">
                                            {results.analyse.neededE1 ? (
                                                <p className="result-text">Note minimale nécessaire à l&apos;examen final pour valider : <b>{results.analyse.neededE1} / 20</b></p>
                                            ) : (
                                                <>
                                                    <p className="result-text">Note globale de contrôle continu (CC) : <b>{results.analyse.CC} / 20</b></p>
                                                    <NoteProgressBar value={parseFloat(results.analyse.NS1)} />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FORMULAIRE LANGAGE C */}
                            {selectedMatiere === 'c' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="cc">Devoir Table (CC)</label>
                                            <input id="cc" type="number" placeholder="CC" className="apple-input" value={c.CC} onChange={e => setC({ ...c, CC: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="proj">Note Projet</label>
                                            <input id="proj" type="number" placeholder="Projet (P)" className="apple-input" value={c.P} onChange={e => setC({ ...c, P: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="e">Épreuve Machine (E)</label>
                                            <input id="e" type="number" placeholder="Laissez vide pour simuler" className="apple-input" value={c.E} onChange={e => setC({ ...c, E: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <button type="button" onClick={calcC} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.c && (
                                        <div className="simulator-results">
                                            {results.c.neededE ? (
                                                <p className="result-text">Note minimale nécessaire sur machine (E) pour valider : <b>{results.c.neededE} / 20</b></p>
                                            ) : (
                                                <NoteProgressBar value={parseFloat(results.c.note)} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* FORMULAIRE ALGORITHMIQUE */}
                            {selectedMatiere === 'algo' && (
                                <div className="simulator-form">
                                    <div className="input-container-row">
                                        <div className="input-group">
                                            <label htmlFor="algocc1">Note CC 1</label>
                                            <input id="algocc1" type="number" placeholder="CC1" className="apple-input" value={algo.CC1} onChange={e => setAlgo({ ...algo, CC1: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="algocc2">Note CC 2</label>
                                            <input id="algocc2" type="number" placeholder="CC2" className="apple-input" value={algo.CC2} onChange={e => setAlgo({ ...algo, CC2: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="algopartiel">Examen Partiel</label>
                                            <input id="algopartiel" type="number" placeholder="Partiel" className="apple-input" value={algo.Partiel} onChange={e => setAlgo({ ...algo, Partiel: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="algoassidu">Note Assiduité</label>
                                            <input id="algoassidu" type="number" placeholder="Assiduité" className="apple-input" value={algo.Assiduite} onChange={e => setAlgo({ ...algo, Assiduite: e.target.value })} />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="algoexam">Examen Final</label>
                                            <input id="algoexam" type="number" placeholder="Laissez vide pour simuler" className="apple-input" value={algo.Examen} onChange={e => setAlgo({ ...algo, Examen: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="action-buttons">
                                        <button type="button" onClick={calcAlgo} className="apple-btn-calc">Calculer</button>
                                    </div>
                                    {results.algo && (
                                        <div className="simulator-results">
                                            {results.algo.neededExamen ? (
                                                <p className="result-text">Note minimale nécessaire à l&apos;examen final pour valider : <b>{results.algo.neededExamen} / 20</b></p>
                                            ) : (
                                                <NoteProgressBar value={parseFloat(results.algo.note)} />
                                            )}
                                        </div>
                                    )}
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