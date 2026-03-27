import React, { useState } from 'react';
import NavBar from '../assets/components/NavBar';
import '../assets/stylesheets/index.scss';

const MATIERES = [
    { key: 'proba', label: 'Probabilités' },
    { key: 'analyse', label: 'Analyse-Algèbre' },
    { key: 'c', label: 'Langage C' },
    { key: 'algo', label: "Éléments d'algorithmique" },
];

export default function Simulateur() {
    const [matiere, setMatiere] = useState('proba');
    const [prob, setProb] = useState({ I1: '', I2: '', I3: '', E: '' });
    const [analyse, setAnalyse] = useState({ CC1: '', CC2: '', P: '', E1: '' });
    const [c, setC] = useState({ CC: '', P: '', E: '' });
    const [results, setResults] = useState({ prob: null, analyse: null, c: null });
    // Langage C
    function calcC() {
        const CC = parseFloat(c.CC) || 0;
        const P = parseFloat(c.P) || 0;
        const E = c.E === '' ? null : parseFloat(c.E);
        let note, neededE = null;
        if (E === null) {
            // 0.1*CC + 0.4*P + 0.5*E >= 10
            // neededE = (10 - 0.1*CC - 0.4*P) / 0.5
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
            // On cherche la plus petite valeur de E telle que NF >= 10
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

    // Style commun pour les inputs (reprend la recherche de Ressources)
    const inputStyle = {
        flex: 1,
        padding: '0.5rem 2.2rem 0.5rem 1rem',
        borderRadius: 20,
        border: '1px solid #ccc',
        fontSize: '1rem',
        marginBottom: 8,
        marginRight: 8,
        minWidth: 120,
        maxWidth: 180,
    };
    const btnStyle = {
        padding: '0.75rem 1.25rem',
        borderRadius: '2rem',
        fontSize: '1rem',
        marginRight: '1rem',
        cursor: 'pointer',
        backgroundColor: 'black',
        color: 'white',
        border: '1px solid black',
        boxShadow: '0px 5px 0px 0px rgba(0, 0, 0, 0.1)',
        transition: 'box-shadow 0.3s, transform 0.3s',
    };

    return (
        <div className="ressources">
            <NavBar />
            <div className="container" style={{ marginTop: 40 }}>
                <h2 className="mb-4 mt-4" style={{ fontFamily: 'Aleo, serif', fontWeight: 700 }}>Simulateur de note (MCC)</h2>
                <p style={{ marginBottom: 24 }}>En cas de doute, privilégiez toujours une bonne préparation à l'examen plutôt que de viser une note précise. Le simulateur peut contenir des erreurs ou des approximations.</p>
                <div className="row">
                    {/* Card de sélection matière */}
                    <div className="col-xs-12 col-lg-4">
                        <div className="resource-tree" style={{ minHeight: 220, marginBottom: 24 }}>
                            <h4 style={{ fontFamily: 'Aleo, serif', fontWeight: 700, marginBottom: 16 }}>Choisir la matière</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {MATIERES.map(m => (
                                    <button
                                        key={m.key}
                                        className={matiere === m.key ? 'btn btn-black' : 'btn btn-outline-black'}
                                        style={{ marginBottom: 8, textAlign: 'left', fontWeight: 600, fontFamily: 'Rubik, sans-serif', border: matiere === m.key ? '2px solid black' : '1px solid #ccc', background: matiere === m.key ? 'black' : 'white', color: matiere === m.key ? 'white' : 'black' }}
                                        onClick={() => setMatiere(m.key)}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Formulaire dynamique à droite */}
                    <div className="col-xs-12 col-lg-8">
                        <div className="resource-viewer" style={{ minHeight: 320 }}>
                            {matiere === 'proba' && (
                                <section>
                                    <h3 style={{ fontFamily: 'Aleo, serif', fontWeight: 700, marginBottom: 16 }}>Probabilités</h3>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                                        <input type="number" placeholder="I1" value={prob.I1} onChange={e => setProb({ ...prob, I1: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="I2" value={prob.I2} onChange={e => setProb({ ...prob, I2: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="I3" value={prob.I3} onChange={e => setProb({ ...prob, I3: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="E (partiel)" value={prob.E} onChange={e => setProb({ ...prob, E: e.target.value })} style={inputStyle} />
                                        <button onClick={calcProb} style={btnStyle}>Calculer</button>
                                    </div>
                                    {results.prob && (
                                        <div style={{ marginTop: 8 }}>
                                            {results.prob.neededE ? (
                                                <div>Note minimale à l'examen pour valider : <b>{results.prob.neededE}</b></div>
                                            ) : (
                                                <>
                                                    <div>Note d'interros (I) : <b>{results.prob.I}</b></div>
                                                    <div style={{ marginTop: 8 }}>
                                                      <NoteProgressBar value={parseFloat(results.prob.NF)} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </section>
                            )}
                            {matiere === 'c' && (
                                <section>
                                    <h3 style={{ fontFamily: 'Aleo, serif', fontWeight: 700, marginBottom: 16 }}>Langage C</h3>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                                        <input type="number" placeholder="CC (devoir sur table)" value={c.CC} onChange={e => setC({ ...c, CC: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="P (projet)" value={c.P} onChange={e => setC({ ...c, P: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="E (examen)" value={c.E} onChange={e => setC({ ...c, E: e.target.value })} style={inputStyle} />
                                        <button onClick={calcC} style={btnStyle}>Calculer</button>
                                    </div>
                                    {results.c && (
                                        <div style={{ marginTop: 8 }}>
                                            {results.c.neededE ? (
                                                <div>Note minimale à l'examen pour valider : <b>{results.c.neededE}</b></div>
                                            ) : (
                                                <div style={{ marginTop: 8 }}>
                                                  <NoteProgressBar value={parseFloat(results.c.note)} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>
                            )}
                            {matiere === 'algo' && (
                                <section>
                                    <h3 style={{ fontFamily: 'Aleo, serif', fontWeight: 700, marginBottom: 16 }}>Éléments d'algorithmique</h3>
                                    <img src="/images/rickroll.gif" alt="rickroll" style={{ maxWidth: 320, width: '100%', borderRadius: 16, marginBottom: 16 }} />
                                    <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#d32f2f' }}>
                                        Même le simulateur ne sait pas comment valider cette matière.<br />Bonne chance&nbsp;!
                                    </div>
                                </section>
                            )}
                            {matiere === 'analyse' && (
                                <section>
                                    <h3 style={{ fontFamily: 'Aleo, serif', fontWeight: 700, marginBottom: 16 }}>Analyse-Algèbre</h3>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                                        <input type="number" placeholder="CC1" value={analyse.CC1} onChange={e => setAnalyse({ ...analyse, CC1: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="CC2" value={analyse.CC2} onChange={e => setAnalyse({ ...analyse, CC2: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="P (partiel)" value={analyse.P} onChange={e => setAnalyse({ ...analyse, P: e.target.value })} style={inputStyle} />
                                        <input type="number" placeholder="E1 (final)" value={analyse.E1} onChange={e => setAnalyse({ ...analyse, E1: e.target.value })} style={inputStyle} />
                                        <button onClick={calcAnalyse} style={btnStyle}>Calculer</button>
                                    </div>
                                    {results.analyse && (
                                        <div style={{ marginTop: 8 }}>
                                            {results.analyse.neededE1 ? (
                                                <div>Note minimale à l'examen final pour valider : <b>{results.analyse.neededE1}</b></div>
                                            ) : (
                                                <>
                                                    <div>Note de contrôle continu (CC) : <b>{results.analyse.CC}</b></div>
                                                    <div style={{ marginTop: 8 }}>
                                                      <NoteProgressBar value={parseFloat(results.analyse.NS1)} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Progress bar composant
function NoteProgressBar({ value }) {
    let color = '#d32f2f', label = 'Défaillant';
    if (value >= 16) {
        color = '#7cb342'; label = 'Très bien';
    } else if (value >= 14) {
        color = '#388e3c'; label = 'Bien';
    } else if (value >= 12) {
        color = '#1976d2'; label = 'Assez bien';
    } else if (value >= 10) {
        color = '#fbc02d'; label = 'Validé';
    }
    // Popover au survol
    const [show, setShow] = useState(false);
    return (
        <div style={{ position: 'relative', margin: '12px 0' }}>
            <div
                style={{
                    width: '100%',
                    height: 22,
                    background: '#eee',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                }}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                <div style={{
                    width: `${Math.max(0, Math.min(20, value)) * 5}%`,
                    height: '100%',
                    background: color,
                    transition: 'width 0.4s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 16,
                    paddingRight: 12,
                }}>
                    {value !== undefined && !isNaN(value) ? value : ''}
                </div>
            </div>
            {show && (
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: -38,
                    transform: 'translateX(-50%)',
                    background: '#222',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>{label}</div>
            )}
        </div>
    );
}