'use client';

import React, { useState, useEffect, useMemo } from 'react';
import DockNav from '../../assets/components/DockNav';
import '../../assets/stylesheets/dlmi-poll.scss';

// Palette dégradée du Bleu (accord) au Rouge (désaccord)
const RESPONSE_META = {
    "Totalement d'accord": { color: '#0051d5', order: 1 },
    "Plutôt d'accord": { color: '#3b82f6', order: 2 },
    "D'accord": { color: '#1d6ce0', order: 1.5 },
    "Neutre": { color: '#8e8e93', order: 3 },
    "Plutôt pas d'accord": { color: '#f97316', order: 4 },
    "Pas d'accord": { color: '#e11d48', order: 4.5 },
    "Absolument pas d'accord": { color: '#dc2626', order: 5 },

    "Oui": { color: '#1d6ce0', order: 1 },
    "Je ne savais pas qu'il y avait un DM": { color: '#8e8e93', order: 2 },
    "Non": { color: '#dc2626', order: 3 },
};

const UE_GROUPS = [
    {
        key: 'proba',
        label: 'Intégration & Probabilités',
        icon: 'fa-infinity',
        defaultOpen: true,
    },
    {
        key: 'groupes',
        label: 'Groupes & Actions',
        icon: 'fa-shapes',
        defaultOpen: false,
    },
    {
        key: 'diff',
        label: 'Calcul Différentiel',
        icon: 'fa-chart-line',
        defaultOpen: false,
    },
];

function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
            if (char === '\r') i++;
            currentRow.push(currentField.trim());
            if (currentRow.some((cell) => cell !== '')) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }

    if (currentField !== '' || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some((cell) => cell !== '')) {
            rows.push(currentRow);
        }
    }

    return rows;
}

function classifyQuestion(header, colIndex) {
    const prefix = "J'ai compris et suis confiant pour le partiel pour cette partie du programme :";
    if (header.startsWith(prefix)) {
        const cleanChapter = header.replace(prefix, '').trim();
        let ueKey = 'proba';
        if (colIndex >= 10 && colIndex <= 15) ueKey = 'groupes';
        else if (colIndex >= 16 && colIndex <= 20) ueKey = 'diff';

        return { category: 'programme', ueKey, label: cleanChapter, isLikert: true };
    }

    if (colIndex >= 1 && colIndex <= 4) {
        return {
            category: 'ressenti',
            ueKey: null,
            label: header,
            isLikert: colIndex !== 4,
        };
    }

    if (colIndex === 21) {
        return { category: 'suggestions', ueKey: null, label: header, isLikert: false };
    }

    return { category: 'mobilisation', ueKey: null, label: header, isLikert: false };
}

function normalizeAnswer(answer, simplified) {
    if (!simplified) return answer;
    if (answer === "Totalement d'accord" || answer === "Plutôt d'accord") {
        return "D'accord";
    }
    if (answer === "Absolument pas d'accord" || answer === "Plutôt pas d'accord") {
        return "Pas d'accord";
    }
    return answer;
}

export default function DlmiPollPage() {
    const [rawRows, setRawRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [simplified, setSimplified] = useState(true);

    // État d'ouverture des accordéons
    const [openAccordions, setOpenAccordions] = useState({
        ressenti: true,
        proba: true,
        groupes: false,
        diff: false,
    });

    const toggleAccordion = (key) => {
        setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    useEffect(() => {
        fetch('/resources/university/questionnaire-22-nov-visio.csv')
            .then((res) => {
                if (!res.ok) throw new Error('Impossible de charger le fichier CSV.');
                return res.text();
            })
            .then((text) => {
                setRawRows(parseCSV(text));
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const { questions, totalRespondents, kpis } = useMemo(() => {
        if (rawRows.length < 2) {
            return { questions: [], totalRespondents: 0, kpis: null };
        }

        const headers = rawRows[0];
        const answersRows = rawRows.slice(1);
        const total = answersRows.length;

        const parsedQuestions = headers.slice(1).map((header, idx) => {
            const colIndex = idx + 1;
            const meta = classifyQuestion(header, colIndex);
            const rawAnswers = answersRows
                .map((row) => row[colIndex])
                .filter((val) => val && val.trim() !== '');

            if (meta.category === 'suggestions') {
                return {
                    ...meta,
                    colIndex,
                    totalAnswers: rawAnswers.length,
                    verbatims: rawAnswers,
                    distribution: [],
                };
            }

            const counts = {};
            rawAnswers.forEach((ans) => {
                const key = meta.isLikert ? normalizeAnswer(ans, simplified) : ans;
                counts[key] = (counts[key] || 0) + 1;
            });

            const distribution = Object.entries(counts)
                .map(([label, count]) => ({
                    label,
                    count,
                    pct: rawAnswers.length > 0 ? Math.round((count / rawAnswers.length) * 1000) / 10 : 0,
                    color: RESPONSE_META[label]?.color || '#64748b',
                    order: RESPONSE_META[label]?.order ?? 99,
                }))
                .sort((a, b) => a.order - b.order);

            return {
                ...meta,
                colIndex,
                totalAnswers: rawAnswers.length,
                distribution,
            };
        });

        const decrochage = answersRows.filter((r) =>
            ["Totalement d'accord", "Plutôt d'accord"].includes(r[3])
        ).length;
        const confianceSemestre = answersRows.filter((r) =>
            ["Totalement d'accord", "Plutôt d'accord"].includes(r[2])
        ).length;
        const tutoratOui = answersRows.filter((r) => r[24] === 'Oui').length;

        return {
            questions: parsedQuestions,
            totalRespondents: total,
            kpis: {
                decrochagePct: Math.round((decrochage / total) * 100),
                confiancePct: Math.round((confianceSemestre / total) * 100),
                tutoratPct: Math.round((tutoratOui / total) * 100),
            },
        };
    }, [rawRows, simplified]);

    const ressentiQuestions = questions.filter((q) => q.category === 'ressenti');
    const programmeQuestions = questions.filter((q) => q.category === 'programme');
    const mobilisationQuestions = questions.filter((q) => q.category === 'mobilisation');
    const suggestionsQuestion = questions.find((q) => q.category === 'suggestions');

    return (
        <div className="dlmi-poll-page">
            <main className="dlmi-poll-shell">
                <section className="dlmi-poll-hero">
                    <span className="dlmi-poll-kicker">
                        <i className="fas fa-chart-pie" /> Consultation DLMI · 22 nov. 2026
                    </span>
                    <h1>Bilan du questionnaire étudiant</h1>
                    <p>
                        Synthèse des retours de la promotion sur le suivi des cours en distanciel, la préparation aux partiels et la mobilisation collective.
                    </p>
                </section>

                {loading && <p className="text-center">Chargement des données du questionnaire...</p>}
                {error && <p className="text-center text-danger">{error}</p>}

                {!loading && !error && (
                    <>
                        {/* BARRE DE CONTRÔLE STICKY */}
                        <div className="dlmi-controls-bar">
                            <div className="dlmi-respondent-pill">
                                <i className="fas fa-users" />
                                <span>
                                    <strong>{totalRespondents}</strong> réponses sur 39
                                </span>
                            </div>

                            <label className="simplified-switch-label" htmlFor="simplified-mode-switch">
                                <span>Mode simplifié</span>
                                <button
                                    id="simplified-mode-switch"
                                    type="button"
                                    role="switch"
                                    aria-checked={simplified}
                                    className={`ios-switch ${simplified ? 'is-checked' : ''}`}
                                    onClick={() => setSimplified((prev) => !prev)}
                                >
                                    <span className="ios-switch-thumb" />
                                </button>
                            </label>
                        </div>

                        {/* CHIFFRES CLÉS */}
                        {kpis && (
                            <div className="dlmi-kpi-grid">
                                <div className="dlmi-kpi-card">
                                    <div className="kpi-label">En décrochage</div>
                                    <div className="kpi-value" style={{ color: '#dc2626' }}>
                                        {kpis.decrochagePct} %
                                    </div>
                                    <div className="kpi-sub">en difficulté pour travailler</div>
                                </div>
                                <div className="dlmi-kpi-card">
                                    <div className="kpi-label">Confiance semestre</div>
                                    <div className="kpi-value" style={{ color: '#1d6ce0' }}>
                                        {kpis.confiancePct} %
                                    </div>
                                    <div className="kpi-sub">confiants pour valider</div>
                                </div>
                                <div className="dlmi-kpi-card">
                                    <div className="kpi-label">Tutorat B.U.</div>
                                    <div className="kpi-value" style={{ color: '#0051d5' }}>
                                        {kpis.tutoratPct} %
                                    </div>
                                    <div className="kpi-sub">prêts à réviser ensemble</div>
                                </div>
                            </div>
                        )}

                        {/* ACCORDÉON 1 : RESSENTI & SITUATION GÉNÉRALE */}
                        <PollAccordion
                            title="Ressenti & Situation générale"
                            subtitle="Isolement, confiance pour le semestre, décrochage et DM"
                            icon="fa-heart-pulse"
                            count={`${ressentiQuestions.length} questions`}
                            isOpen={openAccordions.ressenti}
                            onToggle={() => toggleAccordion('ressenti')}
                        >
                            <div className="dlmi-questions-list">
                                {ressentiQuestions.map((q) => (
                                    <PollQuestionRow key={q.colIndex} question={q} />
                                ))}
                            </div>
                        </PollAccordion>

                        {/* ACCORDÉONS PAR UE : MAÎTRISE DU PROGRAMME */}
                        <section className="dlmi-section">
                            <h2 className="dlmi-section-title">
                                <i className="fas fa-book-open" /> Maîtrise du programme par UE
                            </h2>

                            {UE_GROUPS.map((ue) => {
                                const ueQuestions = programmeQuestions.filter((q) => q.ueKey === ue.key);
                                return (
                                    <PollAccordion
                                        key={ue.key}
                                        title={ue.label}
                                        subtitle={'« J\'ai compris et suis confiant pour le partiel pour cette partie du programme »'}
                                        icon={ue.icon}
                                        count={`${ueQuestions.length} parties`}
                                        isOpen={openAccordions[ue.key]}
                                        onToggle={() => toggleAccordion(ue.key)}
                                    >
                                        <div className="dlmi-questions-list">
                                            {ueQuestions.map((q) => (
                                                <PollQuestionRow key={q.colIndex} question={q} />
                                            ))}
                                        </div>
                                    </PollAccordion>
                                );
                            })}
                        </section>

                        {/* SECTION MOBILISATION & AG */}
                        <section className="dlmi-section">
                            <h2 className="dlmi-section-title">
                                <i className="fas fa-bullhorn" /> Assemblées générales & Tutorat
                            </h2>
                            <div className="dlmi-simple-card">
                                <div className="dlmi-questions-list">
                                    {mobilisationQuestions.map((q) => (
                                        <PollQuestionRow key={q.colIndex} question={q} />
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* SECTION SUGGESTIONS LIBRES */}
                        {suggestionsQuestion && suggestionsQuestion.verbatims.length > 0 && (
                            <section className="dlmi-section">
                                <h2 className="dlmi-section-title">
                                    <i className="fas fa-comment-dots" /> Messages & Suggestions ({suggestionsQuestion.verbatims.length})
                                </h2>
                                <div className="verbatims-grid">
                                    {suggestionsQuestion.verbatims.map((msg, i) => (
                                        <blockquote key={i} className="verbatim-card">
                                            <i className="fas fa-quote-left" />
                                            {msg}
                                        </blockquote>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>

            <DockNav />
            <div className="glow glow-a" aria-hidden="true" />
            <div className="glow glow-b" aria-hidden="true" />
        </div>
    );
}

function PollAccordion({ title, subtitle, icon, count, isOpen, onToggle, children }) {
    return (
        <div className={`dlmi-accordion ${isOpen ? 'is-open' : ''}`}>
            <button
                type="button"
                className="dlmi-accordion-trigger"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className="accordion-title-group">
                    <span className="accordion-icon" aria-hidden="true">
                        <i className={`fas ${icon}`} />
                    </span>
                    <div>
                        <h3 className="accordion-heading">{title}</h3>
                        {subtitle && <p className="accordion-subtitle">{subtitle}</p>}
                    </div>
                </div>

                <div className="accordion-right">
                    <span className="accordion-count-pill">{count}</span>
                    <span className={`accordion-chevron ${isOpen ? 'is-rotated' : ''}`} aria-hidden="true">
                        <i className="fas fa-chevron-down" />
                    </span>
                </div>
            </button>

            {isOpen && <div className="dlmi-accordion-body">{children}</div>}
        </div>
    );
}

function PollQuestionRow({ question }) {
    return (
        <article className="poll-question-row">
            <h4 className="poll-question-title">{question.label}</h4>

            <div className="stacked-bar-track" role="img" aria-label={question.label}>
                {question.distribution.map((seg) => (
                    <div
                        key={seg.label}
                        className="stacked-bar-segment"
                        style={{
                            width: `${seg.pct}%`,
                            backgroundColor: seg.color,
                        }}
                        title={`${seg.label} : ${seg.pct}% (${seg.count})`}
                    >
                        {seg.pct >= 8 ? `${Math.round(seg.pct)}%` : ''}
                    </div>
                ))}
            </div>

            <div className="poll-breakdown-list">
                {question.distribution.map((seg) => (
                    <div key={seg.label} className="breakdown-chip">
                        <span className="chip-swatch" style={{ backgroundColor: seg.color }} />
                        <span>{seg.label} :</span>
                        <strong>{seg.pct} %</strong>
                        <span className="chip-count">({seg.count})</span>
                    </div>
                ))}
            </div>
        </article>
    );
}