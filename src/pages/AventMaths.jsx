import React, { useState, useEffect, useMemo, useRef } from 'react';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';
import '../assets/stylesheets/avent.scss';
import DockNav from '../assets/components/DockNav';

const DEMO_MODE = false; // Afficher / masquer le mode démo pour tester le calendrier en dehors de décembre

function MathText({ content }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        renderMathInElement(containerRef.current, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
        });
    }, [content]);

    return <p ref={containerRef}>{content}</p>;
}

// Données des 24 jours avec formules LaTeX formatées
const JOURS_AVENT = [
    {
        day: 1,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-infinity',
        titre: 'Séries & Convergence',
        question: String.raw`Soit $(u_n)_{n \ge 0}$ une suite réelle telle que $\lim_{n \to +\infty} (u_{n+1} - u_n) = 0$. Étudier la nature de la série associée et déterminer un équivalent simple.`,
        solution: String.raw`En utilisant le critère de Cauchy et une sommation par parties, on montre que la série associée peut diverger logarithmiquement selon la vitesse de convergence vers $0$.`
    },
    {
        day: 2,
        span: 'span-2x1',
        theme: 'crimson',
        icon: 'fa-shapes',
        titre: 'Sous-groupes distingués',
        question: String.raw`Montrer que tout sous-groupe $H$ d'indice $[G : H] = 2$ d'un groupe fini $G$ est nécessairement normal ($H \trianglelefteq G$).`,
        solution: String.raw`Les partitions en classes à gauche et à droite ne comportent que deux éléments ($H$ et $G \setminus H$), d'où $gH = Hg$ pour tout $g \in G$.`
    },
    {
        day: 3,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-wave-square',
        titre: 'Intégrale de Dirichlet',
        question: String.raw`Calculer la valeur de l'intégrale impropre $\displaystyle \int_0^{+\infty} \frac{\sin(x)}{x}\,\mathrm{d}x$ à l'aide d'une intégrale à paramètre.`,
        solution: String.raw`En introduisant $I(t) = \int_0^{+\infty} e^{-tx}\frac{\sin(x)}{x}\,\mathrm{d}x$ pour $t \ge 0$, on obtient par dérivation sous le signe somme que $I(0) = \frac{\pi}{2}$.`
    },
    {
        day: 4,
        span: 'span-1x2',
        theme: 'ink',
        icon: 'fa-project-diagram',
        titre: 'Graphes eulériens',
        question: String.raw`Démontrer qu'un graphe connexe non orienté $G = (V, E)$ admet un cycle eulérien si et seulement si $\forall v \in V,\ \deg(v) \equiv 0 \pmod{2}$.`,
        solution: String.raw`Par récurrence sur $|E|$ : on extrait un premier cycle fermé puis on recolle les cycles eulériens des composantes connexes restantes.`
    },
    {
        day: 5,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-dice',
        titre: 'Paradoxe des anniversaires',
        question: String.raw`Combien de personnes faut-il réunir pour que la probabilité que deux d'entre elles aient la même date d'anniversaire dépasse $\frac{1}{2}$ ?`,
        solution: String.raw`À partir de $n = 23$ personnes, on a $P = 1 - \frac{365!}{365^{23} \cdot 342!} \approx 0{,}507 > \frac{1}{2}$.`
    },
    {
        day: 6,
        span: 'span-1x2',
        theme: 'crimson',
        icon: 'fa-chart-line',
        titre: 'Théorème de Rolle généralisé',
        question: String.raw`Soit $f : [0, +\infty[ \to \mathbb{R}$ dérivable telle que $\lim_{x \to +\infty} f(x) = f(0)$. Montrer qu'il existe $c \in ]0, +\infty[$ tel que $f'(c) = 0$.`,
        solution: String.raw`En posant $g(t) = f(\tan t)$ sur $[0, \frac{\pi}{2}[$ prolongée par continuité en $\frac{\pi}{2}$ par $f(0)$, on applique le théorème de Rolle classique sur $[0, \frac{\pi}{2}]$.`
    },
    {
        day: 7,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-superscript',
        titre: 'Polynômes cyclotomiques',
        question: String.raw`Déterminer le degré et l'expression explicite du $6^{\text{ème}}$ polynôme cyclotomique $\Phi_6(X)$.`,
        solution: String.raw`On a $\deg(\Phi_6) = \varphi(6) = 2$ et $\Phi_6(X) = \frac{X^6 - 1}{(X^3 - 1)(X + 1)} = X^2 - X + 1$.`
    },
    {
        day: 8,
        span: 'span-2x1',
        theme: 'crimson',
        icon: 'fa-compass',
        titre: 'Isométries du cube',
        question: String.raw`Déterminer la structure et le cardinal du groupe $\mathrm{Isom}^+(\mathcal{C})$ des isométries directes laissant un cube $\mathcal{C}$ globalement invariant.`,
        solution: String.raw`Par action fidèle sur les $4$ grandes diagonales du cube, $\mathrm{Isom}^+(\mathcal{C}) \cong \mathfrak{S}_4$, d'où $|\mathrm{Isom}^+(\mathcal{C})| = 4! = 24$.`
    },
    {
        day: 9,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-percentage',
        titre: 'Loi géométrique sans mémoire',
        question: String.raw`Caractériser les variables aléatoires $X$ à valeurs dans $\mathbb{N}^*$ vérifiant $\forall (n, k) \in \mathbb{N}^2,\ \mathbb{P}(X > n + k \mid X > n) = \mathbb{P}(X > k)$.`,
        solution: String.raw`La condition impose $\mathbb{P}(X > k) = q^k$ avec $q = \mathbb{P}(X > 1) \in ]0, 1[$, donc $X \hookrightarrow \mathcal{G}(1 - q)$.`
    },
    {
        day: 10,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-calculator',
        titre: 'Matrices nilpotentes',
        question: String.raw`Montrer que la trace d'une matrice nilpotente $A \in \mathcal{M}_n(\mathbb{C})$ est toujours nulle.`,
        solution: String.raw`Toutes les valeurs propres complexes de $A$ sont nulles ($\mathrm{Sp}_{\mathbb{C}}(A) = \{0\}$), donc $\mathrm{Tr}(A) = \sum_{i=1}^n \lambda_i = 0$.`
    },
    {
        day: 11,
        span: 'span-1x1',
        theme: 'ink',
        icon: 'fa-vector-square',
        titre: 'Inégalité de Cauchy-Schwarz',
        question: String.raw`Étudier le cas d'égalité $|\langle x, y \rangle| = \|x\| \, \|y\|$ dans un espace préhilbertien réel $(E, \langle \cdot, \cdot \rangle)$.`,
        solution: String.raw`Le discriminant du trinôme $P(t) = \|x + ty\|^2 \ge 0$ est nul si et seulement si la famille $(x, y)$ est liée.`
    },
    {
        day: 12,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-code-branch',
        titre: 'Récurrence & Complexité',
        question: String.raw`Résoudre la relation de récurrence $T(n) = 2T(n/2) + \mathcal{O}(n \log n)$ par le Master Theorem.`,
        solution: String.raw`Comme $n^{\log_2 2} = n$, on se situe dans le cas critique avec facteur $\log^1 n$, d'où $T(n) = \Theta(n \log^2 n)$.`
    },
    {
        day: 13,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-divide',
        titre: 'Petit théorème de Fermat',
        question: String.raw`Calculer le reste de la division euclidienne de $3^{2026}$ par $17$.`,
        solution: String.raw`Par le petit théorème de Fermat, $3^{16} \equiv 1 \pmod{17}$. Comme $2026 = 16 \times 126 + 10$, on a $3^{2026} \equiv 3^{10} \equiv 8 \pmod{17}$.`
    },
    {
        day: 14,
        span: 'span-1x2',
        theme: 'sand',
        icon: 'fa-cubes',
        titre: 'Compacité en dimension finie',
        question: String.raw`Pourquoi la boule unité fermée $\overline{B}(0, 1)$ d'un espace vectoriel normé $E$ est-elle compacte si et seulement si $\dim(E) < +\infty$ ?`,
        solution: String.raw`C'est le théorème de Riesz : en dimension infinie, le lemme de Riesz permet de construire une suite de la sphère unité sans sous-suite convergente.`
    },
    {
        day: 15,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-sigma',
        titre: 'Somme des inverses des carrés',
        question: String.raw`Retrouver $\zeta(2) = \sum_{n=1}^{+\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$ à l'aide de la série de Fourier de $f(x) = x^2$ sur $[-\pi, \pi]$.`,
        solution: String.raw`L'identité de Parseval appliquée aux coefficients de Fourier $c_n(f) = \frac{2(-1)^n}{n^2}$ donne directement $\sum_{n=1}^{+\infty} \frac{1}{n^4}$, et l'évaluation en $\pi$ donne $\zeta(2) = \frac{\pi^2}{6}$.`
    },
    {
        day: 16,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-braille',
        titre: 'Espaces connexes par arcs',
        question: String.raw`Montrer que $\mathrm{GL}_n(\mathbb{C})$ est connexe par arcs alors que $\mathrm{GL}_n(\mathbb{R})$ possède exactement deux composantes connexes.`,
        solution: String.raw`L'application $\det$ est continue sur $\mathbb{R}^*$ qui possède deux composantes ($]0, +\infty[$ et $]-\infty, 0[$), tandis que $\mathbb{C}^*$ est connexe par arcs.`
    },
    {
        day: 17,
        span: 'span-2x1',
        theme: 'forest',
        icon: 'fa-random',
        titre: 'Loi forte des grands nombres',
        question: String.raw`Énoncer les hypothèses minimales pour la convergence presque sûre de $\overline{X}_n = \frac{1}{n} \sum_{k=1}^n X_k$.`,
        solution: String.raw`Des variables aléatoires $(X_k)_{k \ge 1}$ i.i.d. et intégrables ($\mathbb{E}[|X_1|] < +\infty$) suffisent pour assurer $\overline{X}_n \xrightarrow{\text{p.s.}} \mathbb{E}[X_1]$.`
    },
    {
        day: 18,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-border-all',
        titre: 'Déterminant de Vandermonde',
        question: String.raw`Factoriser le déterminant de Vandermonde $V(x_1, \dots, x_n)$ et donner une condition nécessaire et suffisante d'inversibilité.`,
        solution: String.raw`On a $V(x_1, \dots, x_n) = \prod_{1 \le i < j \le n} (x_j - x_i)$, non nul si et seulement si les scalaires $x_1, \dots, x_n$ sont deux à deux distincts.`
    },
    {
        day: 19,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-angle-double-right',
        titre: 'Développement asymptotique',
        question: String.raw`Donner un développement asymptotique à trois termes de l'unique solution $u_n \in \left]n\pi, n\pi + \frac{\pi}{2}\right[$ de l'équation $\tan(u_n) = u_n$.`,
        solution: String.raw`En inversant $u_n = n\pi + \arctan(u_n)$, on obtient $u_n = n\pi + \frac{\pi}{2} - \frac{1}{n\pi} + \mathcal{O}\!\left(\frac{1}{n^2}\right)$.`
    },
    {
        day: 20,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-circle-notch',
        titre: 'Théorème des résidus',
        question: String.raw`Calculer $\displaystyle \int_{-\infty}^{+\infty} \frac{\mathrm{d}x}{1 + x^4}$ en intégrant sur un demi-cercle supérieur de rayon $R \to +\infty$.`,
        solution: String.raw`En sommant les résidus aux pôles simples $z_1 = e^{i\pi/4}$ et $z_2 = e^{3i\pi/4}$ situés dans le demi-plan supérieur, on trouve $\frac{\pi\sqrt{2}}{2}$ sur $\mathbb{R}$ (et $\frac{\pi\sqrt{2}}{4}$ sur $\mathbb{R}_+$).`
    },
    {
        day: 21,
        span: 'span-1x2',
        theme: 'crimson',
        icon: 'fa-stream',
        titre: 'Diagonalisation simultanée',
        question: String.raw`Montrer que deux endomorphismes diagonalisables $u, v \in \mathcal{L}(E)$ qui commutent ($u \circ v = v \circ u$) sont co-diagonalisables.`,
        solution: String.raw`Les sous-espaces propres $E_\lambda(u)$ sont stables par $v$, et la restriction $v_{|E_\lambda(u)}$ reste diagonalisable, ce qui fournit une base commune de vecteurs propres.`
    },
    {
        day: 22,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-balance-scale',
        titre: 'Inégalité de Jensen',
        question: String.raw`Appliquer l'inégalité de Jensen à la fonction $\ln$ pour démontrer l'inégalité arithmético-géométrique sur $x_1, \dots, x_n > 0$.`,
        solution: String.raw`Par concavité de $\ln$, $\ln\!\left(\frac{1}{n}\sum_{i=1}^n x_i\right) \ge \frac{1}{n}\sum_{i=1}^n \ln(x_i)$, d'où $\sqrt[n]{x_1 \cdots x_n} \le \frac{x_1 + \dots + x_n}{n}$ par croissance de $\exp$.`
    },
    {
        day: 23,
        span: 'span-2x1',
        theme: 'crimson',
        icon: 'fa-atom',
        titre: 'Théorème spectral',
        question: String.raw`Démontrer que toute matrice symétrique réelle $S \in \mathcal{S}_n(\mathbb{R})$ est orthogonalement semblable à une matrice diagonale.`,
        solution: String.raw`Par récurrence sur $n$ en utilisant l'orthogonal $H = (\mathbb{R}e_1)^\perp$ d'un vecteur propre unitaire, qui est stable par l'endomorphisme symétrique associé.`
    },
    {
        day: 24,
        span: 'span-2x2',
        theme: 'grand-finale',
        icon: 'fa-star',
        titre: 'Le défi du Réveillon',
        question: String.raw`Problème de synthèse : relier la fonction zêta de Riemann $\zeta(s) = \sum_{n=1}^{+\infty} \frac{1}{n^s}$, l'ensemble $\mathcal{P}$ des nombres premiers et le produit eulérien pour $\mathrm{Re}(s) > 1$.`,
        solution: String.raw`Joyeux Noël ! Par unicité de la décomposition en facteurs premiers dans $\mathbb{N}^*$, on obtient $\displaystyle \zeta(s) = \prod_{p \in \mathcal{P}} \left(1 - p^{-s}\right)^{-1}$.`
    }
];

function shuffleDeterministic(items, seed = 2026) {
    const array = [...items];
    let currentSeed = seed;
    const nextRandom = () => {
        currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
        return currentSeed / 4294967296;
    };

    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(nextRandom() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function AventMaths() {
    // Récupération de la date du jour (en décembre : jour entre 1 et 24)
    const getRealDecemberDay = () => {
        const now = new Date();
        if (now.getMonth() === 11) {
            return now.getDate();
        }
        return DEMO_MODE ? 1 : 0; // En dehors de décembre : 1er déc. en démo, verrouillé sinon
    };

    const [demoDay, setDemoDay] = useState(getRealDecemberDay);
    const activeDay = DEMO_MODE ? demoDay : getRealDecemberDay();

    const [selectedDay, setSelectedDay] = useState(null);
    const [showSolution, setShowSolution] = useState(false);

    // Ordre d'affichage mélangé (mémorisé une seule fois)
    const shuffledJours = useMemo(() => shuffleDeterministic(JOURS_AVENT, 2412), []);

    // Suivi des cases déjà ouvertes dans localStorage
    const [openedDays, setOpenedDays] = useState(() => {
        try {
            const saved = localStorage.getItem('avent_maths_opened');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('avent_maths_opened', JSON.stringify(openedDays));
    }, [openedDays]);

    const handleOpenDoor = (item) => {
        if (item.day > activeDay) return;

        setSelectedDay(item);
        setShowSolution(false);

        if (!openedDays.includes(item.day)) {
            setOpenedDays((prev) => [...prev, item.day]);
        }
    };

    const isSolutionUnlocked = selectedDay ? activeDay > selectedDay.day : false;

    return (
        <div className="avent-page">
            <div className="avent-ambient-decorations" aria-hidden="true">
                <i className="fas fa-snowflake ambient-item ambient-flake-1" />
                <i className="fas fa-snowflake ambient-item ambient-flake-2" />
                <i className="fas fa-infinity ambient-item ambient-math-1" />
                <i className="fas fa-superscript ambient-item ambient-math-2" />
            </div>

            <main className="avent-shell">
                <div className="avent-board">
                    <aside className="avent-sidebar">
                        <div className="avent-copy">
                            <span className="avent-kicker">
                                <i className="fas fa-snowflake" /> Édition 2026
                            </span>

                            <h1 className="avent-title-lockup">
                                <span className="title-script">L’Avent des</span>
                                <span className="title-serif">Mathématiciens</span>
                            </h1>

                            <p>
                                Chaque jour du 1er au 24 décembre, cherchez et ouvrez la case du jour pour découvrir une question de mathématiques. Le corrigé est débloqué dès le lendemain.
                                <br />
                                <b>Ces questions préparent aux examens de la licence 3.</b>
                            </p>
                        </div>

                        <div className="avent-progress-card">
                            <div className="progress-head">
                                <span>
                                    <i className="fas fa-gift" /> Cases ouvertes
                                </span>
                                <strong>{openedDays.length} / 24</strong>
                            </div>
                            <div className="avent-bar-track">
                                <div
                                    className="avent-bar-fill"
                                    style={{ width: `${(openedDays.length / 24) * 100}%` }}
                                />
                            </div>
                            <p className="avent-hint">
                                <i className="fas fa-clock" />{' '}
                                {activeDay === 0
                                    ? 'Le calendrier commencera le 1er décembre.'
                                    : (
                                        <>
                                            Aujourd'hui : <b>{Math.min(activeDay, 24)} décembre</b> —{' '}
                                            {activeDay < 24
                                                ? 'la solution du jour sera disponible demain.'
                                                : 'toutes les cases sont ouvertes !'}
                                        </>
                                    )}
                            </p>

                            {DEMO_MODE && (
                                <div className="avent-demo-control">
                                    <label htmlFor="demo-day-select">Mode démo :</label>
                                    <select
                                        id="demo-day-select"
                                        value={demoDay}
                                        onChange={(e) => {
                                            setDemoDay(Number(e.target.value));
                                            setShowSolution(false);
                                        }}
                                    >
                                        {Array.from({ length: 25 }, (_, i) => i + 1).map((d) => (
                                            <option key={d} value={d}>
                                                {d <= 24 ? `${d} décembre` : '25 décembre (Tout débloqué)'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Cases du jour */}
                    <section className="avent-grid" aria-label="Grille du calendrier de l'Avent">
                        {shuffledJours.map((item) => {
                            const isUnlocked = item.day <= activeDay;
                            const isToday = item.day === activeDay;
                            const isOpened = openedDays.includes(item.day);

                            return (
                                <button
                                    key={item.day}
                                    type="button"
                                    onClick={() => handleOpenDoor(item)}
                                    disabled={!isUnlocked}
                                    className={[
                                        'avent-tile',
                                        item.span,
                                        `theme-${item.theme}`,
                                        isUnlocked ? 'is-unlocked' : 'is-locked',
                                        isToday ? 'is-today' : '',
                                        isOpened ? 'is-opened' : ''
                                    ].join(' ')}
                                    aria-label={`Case numéro ${item.day}${isUnlocked ? '' : ' (verrouillée)'}`}
                                >
                                    <span className="tile-number">{item.day}</span>

                                    {item.day === 24 && (
                                        <span className="tile-finale-label">Joyeux Noël !</span>
                                    )}

                                    <span className="tile-ornament" aria-hidden="true">
                                        <i className={`fas ${isUnlocked ? item.icon : 'fa-lock'}`} />
                                    </span>

                                    {isToday && <span className="tile-badge-today">Aujourd'hui</span>}
                                    {isOpened && !isToday && (
                                        <span className="tile-check">
                                            <i className="fas fa-check" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </section>
                </div>
            </main>

            {/* Modal du jour */}
            {selectedDay && (
                <div className="avent-modal-backdrop" onClick={() => setSelectedDay(null)}>
                    <div
                        className="avent-modal-card"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="avent-modal-title"
                    >
                        {/* Bandeau festif supérieur */}
                        <div className="avent-modal-banner">
                            <div className="banner-decorations" aria-hidden="true">
                                <i className="fas fa-snowflake banner-flake-1" />
                                <i className="fas fa-snowflake banner-flake-2" />
                                <i className={`fas ${selectedDay.icon} banner-math-icon`} />
                            </div>

                            <div className="modal-day-pill">
                                <i className={`fas ${selectedDay.icon}`} />
                                <span>Case du {selectedDay.day} décembre</span>
                            </div>

                            <button
                                type="button"
                                className="festive-modal-close"
                                onClick={() => setSelectedDay(null)}
                                aria-label="Fermer l'exercice"
                            >
                                <i className="fas fa-times" />
                            </button>
                        </div>

                        <div className="avent-modal-body">
                            <span className="modal-script-subtitle">Défi du jour</span>
                            <h2 id="avent-modal-title">{selectedDay.titre}</h2>

                            <div className="exercise-box">
                                <span className="box-tag">Énoncé</span>
                                <MathText content={selectedDay.question} />
                            </div>

                            {/* Solution */}
                            <div className="solution-actions">
                                <button
                                    type="button"
                                    className={`btn ${isSolutionUnlocked ? 'festive-solution-btn' : 'btn-solution-locked'}`}
                                    disabled={!isSolutionUnlocked}
                                    onClick={() => setShowSolution((prev) => !prev)}
                                >
                                    <i
                                        className={`fas ${
                                            isSolutionUnlocked
                                                ? showSolution
                                                    ? 'fa-eye-slash'
                                                    : 'fa-lightbulb'
                                                : 'fa-lock'
                                        }`}
                                    />
                                    <span>
                                        {isSolutionUnlocked
                                            ? showSolution
                                                ? 'Masquer le corrigé'
                                                : 'Révéler la solution'
                                            : `Solution disponible le ${selectedDay.day + 1} décembre`}
                                    </span>
                                </button>
                            </div>

                            {showSolution && isSolutionUnlocked && (
                                <div className="solution-box">
                                    <span className="box-tag is-solution">
                                        <i className="fas fa-check-circle" /> Corrigé détaillé
                                    </span>
                                    <MathText content={selectedDay.solution} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <DockNav />
        </div>
    );
}