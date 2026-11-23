'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';
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
        titre: String.raw`Inégalité triangulaire inversée`,
        question: String.raw`Rappeler les trois axiomes d'une norme $N$ sur un $\mathbb{K}$-espace vectoriel $E$, puis démontrer l'inégalité triangulaire inversée : $\forall (x,y) \in E^2,\ |\|x\| - \|y\|| \le \|x - y\|$.`,
        solution: String.raw`Une norme vérifie l'homogénéité ($N(\lambda x) = |\lambda|N(x)$), l'inégalité triangulaire ($N(x+y) \le N(x)+N(y)$) et la séparation ($N(x)=0 \Rightarrow x=0$). En écrivant $\|x\| = \|(x-y)+y\| \le \|x-y\| + \|y\|$, on obtient $\|x\| - \|y\| \le \|x-y\|$, et par symétrie des rôles, $|\|x\| - \|y\|| \le \|x-y\|$.`
    },
    {
        day: 2,
        span: 'span-2x1',
        theme: 'crimson',
        icon: 'fa-shapes',
        titre: String.raw`Sous-groupes de $(\mathbb{Z}, +)$`,
        question: String.raw`Rappeler la caractérisation d'un sous-groupe en une seule opération ($x * y^{-1} \in H$) et déterminer la forme générale de tous les sous-groupes de $(\mathbb{Z}, +)$.`,
        solution: String.raw`$H \subset G$ est un sous-groupe si et seulement si $H \neq \emptyset$ et $\forall (x,y) \in H^2,\ x * y^{-1} \in H$. Par division euclidienne par le plus petit élément strictement positif (si $H \neq \{0\}$), les sous-groupes de $(\mathbb{Z}, +)$ sont exactement les $n\mathbb{Z}$ avec $n \in \mathbb{N}$.`
    },
    {
        day: 3,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-wave-square',
        titre: String.raw`Tribu & Tribu borélienne`,
        question: String.raw`Donner les trois axiomes définissant une tribu $\mathcal{A}$ sur un ensemble $\Omega$, puis définir la tribu borélienne $\mathcal{B}(\mathbb{R})$.`,
        solution: String.raw`Une tribu contient $\Omega$, est stable par passage au complémentaire et par réunion dénombrable. La tribu borélienne $\mathcal{B}(\mathbb{R})$ est la plus petite tribu sur $\mathbb{R}$ contenant tous les ouverts (elle est engendrée par les intervalles $]-\infty, a]$ pour $a \in \mathbb{R}$).`
    },
    {
        day: 4,
        span: 'span-1x2',
        theme: 'ink',
        icon: 'fa-project-diagram',
        titre: String.raw`Normes non équivalentes`,
        question: String.raw`Sur $E = \mathcal{C}([0,1], \mathbb{R})$, exhiber une suite de fonctions $(f_n)_{n \ge 1}$ permettant de montrer que les normes $\|\cdot\|_1$ et $\|\cdot\|_\infty$ ne sont pas équivalentes.`,
        solution: String.raw`En posant $f_n(t) = t^n$ sur $[0,1]$, on a $\|f_n\|_\infty = 1$ tandis que $\|f_n\|_1 = \int_0^1 t^n\,\mathrm{d}t = \frac{1}{n+1} \xrightarrow[n\to+\infty]{} 0$. Le rapport $\frac{\|f_n\|_\infty}{\|f_n\|_1} = n+1$ n'est pas borné, donc les normes ne sont pas équivalentes.`
    },
    {
        day: 5,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-dice',
        titre: String.raw`Fonction génératrice`,
        question: String.raw`Soit $X$ une variable aléatoire à valeurs dans $\mathbb{N}$ de fonction génératrice $G_X(t) = \mathbb{E}[t^X]$. Exprimer $\mathbb{P}(X = k)$ et le $k$-ième moment factoriel à l'aide de $G_X$.`,
        solution: String.raw`Pour tout $k \in \mathbb{N}$, on a $\mathbb{P}(X = k) = \frac{G_X^{(k)}(0)}{k!}$, et si $X$ admet un moment d'ordre $k$, $\mathbb{E}[X(X-1)\dots(X-k+1)] = G_X^{(k)}(1^-)$.`
    },
    {
        day: 6,
        span: 'span-1x2',
        theme: 'crimson',
        icon: 'fa-chart-line',
        titre: String.raw`Théorème de Lagrange`,
        question: String.raw`Énoncer le théorème de Lagrange (avec la notion d'indice $[G:H]$) et justifier brièvement pourquoi tout groupe fini d'ordre premier $p$ est cyclique.`,
        solution: String.raw`Si $H$ est un sous-groupe d'un groupe fini $G$, alors $|G| = |H| \times [G:H]$ où $[G:H] = |G/H|$. Si $|G| = p$ premier, tout élément $x \neq e_G$ a un ordre divisant $p$ et différent de $1$, donc égal à $p$, d'où $G = \langle x \rangle$.`
    },
    {
        day: 7,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-superscript',
        titre: String.raw`Boules unités dans $\mathbb{R}^2$`,
        question: String.raw`Décrire géométriquement et analytiquement la boule unité fermée $D((0,0), 1)$ de $\mathbb{R}^2$ pour les normes $\|\cdot\|_1$, $\|\cdot\|_2$ et $\|\cdot\|_\infty$.`,
        solution: String.raw`Pour $\|\cdot\|_2$, c'est le disque fermé $\{x^2+y^2 \le 1\}$ ; pour $\|\cdot\|_\infty$, le carré $[-1,1]^2$ ($\max(|x|,|y|) \le 1$) ; pour $\|\cdot\|_1$, le losange $\{|x|+|y| \le 1\}$ de sommets $(\pm 1, 0)$ et $(0, \pm 1)$.`
    },
    {
        day: 8,
        span: 'span-2x1',
        theme: 'crimson',
        icon: 'fa-compass',
        titre: String.raw`Inégalités de Markov & Tchebychev`,
        question: String.raw`Énoncer l'inégalité de Markov généralisée et en déduire l'inégalité de Bienaymé-Tchebychev pour une v.a.r. $X \in L^2$.`,
        solution: String.raw`Pour $\varphi : \mathbb{R}_+ \to \mathbb{R}_+$ croissante et $a > 0$ avec $\varphi(a) > 0$, $\mathbb{P}(|Y| \ge a) \le \frac{\mathbb{E}[\varphi(|Y|)]}{\varphi(a)}$. En posant $Y = X - \mathbb{E}[X]$, $\varphi(t) = t^2$ et $a = \varepsilon > 0$, on obtient $\mathbb{P}(|X - \mathbb{E}[X]| \ge \varepsilon) \le \frac{\mathrm{Var}(X)}{\varepsilon^2}$.`
    },
    {
        day: 9,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-percentage',
        titre: String.raw`Ordre d\'un élément`,
        question: String.raw`Définir l'ordre d'un élément $x$ dans un groupe $G$ et donner la formule de l'ordre de la classe $\overline{a}$ dans le groupe additif $\mathbb{Z}/n\mathbb{Z}$.`,
        solution: String.raw`L'ordre de $x$ est le cardinal de $\langle x \rangle$ (ou le plus petit entier $k > 0$ tel que $x^k = e_G$ s'il est fini). Dans $\mathbb{Z}/n\mathbb{Z}$, l'ordre de $\overline{a}$ vaut $\frac{n}{\mathrm{pgcd}(a, n)}$.`
    },
    {
        day: 10,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-calculator',
        titre: String.raw`Convergence dominée & monotone`,
        question: String.raw`Énoncer les hypothèses et conclusions du théorème de convergence monotone (Beppo-Levi) et du théorème de convergence dominée de Lebesgue.`,
        solution: String.raw`Beppo-Levi : si $(f_n)$ est une suite croissante de fonctions mesurables positives, $\lim \int f_n\,\mathrm{d}\mu = \int (\lim f_n)\,\mathrm{d}\mu$. Lebesgue : si $f_n \to f$ simplement (ou $\mu$-p.p.) et $|f_n| \le g$ avec $g$ $\mu$-intégrable, alors $f$ est intégrable et $\int f_n\,\mathrm{d}\mu \to \int f\,\mathrm{d}\mu$.`
    },
    {
        day: 11,
        span: 'span-1x1',
        theme: 'ink',
        icon: 'fa-vector-square',
        titre: String.raw`Caractérisations séquentielles`,
        question: String.raw`Énoncer la caractérisation séquentielle de l'adhérence $\overline{A}$ d'une partie $A$, puis celle d'une partie fermée $F$ dans un espace vectoriel normé $E$.`,
        solution: String.raw`$a \in \overline{A}$ si et seulement s'il existe une suite $(x_n)$ d'éléments de $A$ convergeant vers $a$. Une partie $F$ est fermée si et seulement si la limite de toute suite convergente d'éléments de $F$ appartient à $F$.`
    },
    {
        day: 12,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-code-branch',
        titre: String.raw`Sous-groupes distingués`,
        question: String.raw`Donner trois caractérisations équivalentes de $H \triangleleft G$ et citer deux sous-groupes non distingués dans $GL_n(\mathbb{R})$ pour $n \ge 2$.`,
        solution: String.raw`$H \triangleleft G \iff \forall x \in G,\ xHx^{-1} \subset H \iff \forall x \in G,\ xH = Hx \iff \forall x \in G,\ xHx^{-1} = H$. Dans $GL_n(\mathbb{R})$ ($n \ge 2$), le groupe orthogonal $O(n)$ et le sous-groupe des matrices triangulaires supérieures inversibles ne sont pas distingués.`
    },
    {
        day: 13,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-divide',
        titre: String.raw`Transformée de Laplace`,
        question: String.raw`Donner la transformée de Laplace $\Psi_X(t) = \mathbb{E}[e^{-tX}]$ et son domaine de définition $I_X$ pour $\mathcal{E}(\lambda)$ et $\mathcal{N}(\mu, \sigma^2)$.`,
        solution: String.raw`Pour $X \sim \mathcal{E}(\lambda)$, $\Psi_X(t) = \frac{\lambda}{\lambda + t}$ sur $I_X = ]-\lambda, +\infty[$. Pour $X \sim \mathcal{N}(\mu, \sigma^2)$, $\Psi_X(t) = \exp\!\left(-t\mu + \frac{\sigma^2 t^2}{2}\right)$ sur $I_X = \mathbb{R}$.`
    },
    {
        day: 14,
        span: 'span-1x2',
        theme: 'sand',
        icon: 'fa-cubes',
        titre: String.raw`Ouverts et fermés matriciels`,
        question: String.raw`En utilisant la continuité de $\det$, justifier rapidement que $GL_n(\mathbb{K})$ est un ouvert de $\mathcal{M}_n(\mathbb{K})$ et que $SL_n(\mathbb{K})$ en est un fermé.`,
        solution: String.raw`L'application $\det : \mathcal{M}_n(\mathbb{K}) \to \mathbb{K}$ est polynomiale donc continue. Ainsi, $GL_n(\mathbb{K}) = \det^{-1}(\mathbb{K}^*)$ est ouvert comme image réciproque d'un ouvert, et $SL_n(\mathbb{K}) = \det^{-1}(\{1\})$ est fermé comme image réciproque du fermé $\{1\}$.`
    },
    {
        day: 15,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-sigma',
        titre: String.raw`Stabilité par somme`,
        question: String.raw`Déterminer la loi de $X + Y$ lorsque $X$ et $Y$ sont indépendantes suivant respectivement $\mathcal{P}(\lambda_1)$ et $\mathcal{P}(\lambda_2)$, puis $\Gamma(a_1, \lambda)$ et $\Gamma(a_2, \lambda)$.`,
        solution: String.raw`Par produit des fonctions génératrices ou transformées de Laplace, on obtient $X + Y \sim \mathcal{P}(\lambda_1 + \lambda_2)$ dans le premier cas, et $X + Y \sim \Gamma(a_1 + a_2, \lambda)$ dans le second.`
    },
    {
        day: 16,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-braille',
        titre: String.raw`Décomposition canonique`,
        question: String.raw`Énoncer le théorème de décomposition canonique (premier théorème d'isomorphisme) pour un morphisme de groupes $f : G \to G'$.`,
        solution: String.raw`Tout morphisme $f : G \to G'$ se décompose en $f = j \circ \tilde{f} \circ \pi$, où $\pi : G \to G/\ker(f)$ est la surjection canonique, $j : \mathrm{Im}(f) \to G'$ l'injection canonique, et $\tilde{f} : G/\ker(f) \to \mathrm{Im}(f)$ définie par $\tilde{f}(x\ker f) = f(x)$ est un isomorphisme de groupes.`
    },
    {
        day: 17,
        span: 'span-2x1',
        theme: 'forest',
        icon: 'fa-random',
        titre: String.raw`Applications linéaires continues`,
        question: String.raw`Donner quatre caractérisations équivalentes de la continuité d'une application linéaire $f \in \mathcal{L}(E,F)$ entre deux espaces vectoriels normés.`,
        solution: String.raw`$f \in \mathcal{L}(E,F)$ est continue $\iff$ $f$ est continue en $0_E$ $\iff$ $\exists C > 0,\ \forall x \in E,\ \|f(x)\|_F \le C\|x\|_E$ $\iff$ $\sup_{\|x\|_E = 1} \|f(x)\|_F < +\infty$ $\iff$ $f$ est lipschitzienne.`
    },
    {
        day: 18,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-border-all',
        titre: String.raw`Minimum d\'exponentielles`,
        question: String.raw`Soient $X_1, \dots, X_n$ des v.a.r. indépendantes suivant des lois $\mathcal{E}(\lambda_1), \dots, \mathcal{E}(\lambda_n)$. Déterminer la loi de $M = \min(X_1, \dots, X_n)$.`,
        solution: String.raw`Pour $t \ge 0$, $\mathbb{P}(M > t) = \prod_{i=1}^n \mathbb{P}(X_i > t) = \prod_{i=1}^n e^{-\lambda_i t} = e^{-\left(\sum_{i=1}^n \lambda_i\right) t}$, donc $M \sim \mathcal{E}\!\left(\sum_{i=1}^n \lambda_i\right)$.`
    },
    {
        day: 19,
        span: 'span-1x1',
        theme: 'crimson',
        icon: 'fa-angle-double-right',
        titre: String.raw`Sous-groupes de $\mathbb{Z}/8\mathbb{Z}$`,
        question: String.raw`Lister tous les sous-groupes propres de $\mathbb{Z}/8\mathbb{Z}$ en précisant leur ordre et leurs éléments.`,
        solution: String.raw`Les sous-groupes propres correspondent aux diviseurs stricts $d \in \{2, 4\}$ de $8$ : $2\mathbb{Z}/8\mathbb{Z} = \{\overline{0}, \overline{2}, \overline{4}, \overline{6}\}$ (d'ordre $4$) et $4\mathbb{Z}/8\mathbb{Z} = \{\overline{0}, \overline{4}\}$ (d'ordre $2$).`
    },
    {
        day: 20,
        span: 'span-1x1',
        theme: 'forest',
        icon: 'fa-circle-notch',
        titre: String.raw`Calcul de norme subordonnée`,
        question: String.raw`On munit $\mathbb{R}^2$ de $\|\cdot\|_\infty$ et on considère $f(x,y) = 3x + 4y$. Calculer sa norme subordonnée $|||f|||$ en justifiant l'égalité.`,
        solution: String.raw`Pour tout $(x,y) \in \mathbb{R}^2$, $|f(x,y)| \le 3|x| + 4|y| \le 7\|(x,y)\|_\infty$, d'où $|||f||| \le 7$. Comme $\|(1,1)\|_\infty = 1$ et $f(1,1) = 7$, la borne est atteinte et $|||f||| = 7$.`
    },
    {
        day: 21,
        span: 'span-1x2',
        theme: 'crimson',
        icon: 'fa-stream',
        titre: String.raw`Étude de la loi Gamma $\Gamma(a, \lambda)$`,
        question: String.raw`Soient $a > 0$ et $\lambda > 0$. Donner la densité $f_X$, l'espérance, la variance et le moment d'ordre $k \ge 1$ d'une variable aléatoire $X \sim \Gamma(a, \lambda)$.`,
        solution: String.raw`La densité de $X$ sur $\mathbb{R}$ est $f_X(x) = \frac{\lambda^a}{\Gamma(a)} x^{a-1} e^{-\lambda x} \mathbf{1}_{\{x > 0\}}$. On a $\mathbb{E}[X] = \frac{a}{\lambda}$, $\mathrm{Var}(X) = \frac{a}{\lambda^2}$, et pour tout entier $k \ge 1$, $\mathbb{E}[X^k] = \frac{a(a+1)\dots(a+k-1)}{\lambda^k}$.`
    },
    {
        day: 22,
        span: 'span-1x1',
        theme: 'sand',
        icon: 'fa-balance-scale',
        titre: String.raw`Cycles et conjugaison dans $S_n$`,
        question: String.raw`Donner la formule de conjugaison $\sigma (a_1 \dots a_r) \sigma^{-1}$ dans $S_n$, puis décomposer $\sigma = \begin{pmatrix} 1 & 2 & 3 & 4 & 5 & 6 & 7 \\ 3 & 2 & 4 & 1 & 7 & 6 & 5 \end{pmatrix}$ et donner son ordre.`,
        solution: String.raw`On a $\sigma (a_1 \dots a_r) \sigma^{-1} = (\sigma(a_1) \dots \sigma(a_r))$. La permutation se décompose en $(1\ 3\ 4)(5\ 7)$ ; les supports étant disjoints, son ordre est $\mathrm{ppcm}(3, 2) = 6$.`
    },
    {
        day: 23,
        span: 'span-2x1',
        theme: 'crimson',
        icon: 'fa-atom',
        titre: String.raw`Compacité et complétude`,
        question: String.raw`Caractériser les compacts en dimension finie (avec un contre-exemple en dimension infinie) et rappeler le lien entre sous-espace complet et fermé dans un espace vectoriel normé complet.`,
        solution: String.raw`En dimension finie, les compacts sont exactement les fermés bornés (faux en dimension infinie, ex. la boule unité fermée de $(\mathcal{C}([0,1]), \|\cdot\|_\infty)$). Dans un espace vectoriel normé complet $(E, \|\cdot\|)$, un sous-espace vectoriel $F$ est complet si et seulement s'il est fermé dans $E$.`
    },
    {
        day: 24,
        span: 'span-2x2',
        theme: 'grand-finale',
        icon: 'fa-star',
        titre: String.raw`Orbites et stabilisateurs`,
        question: String.raw`Définir l'orbite $G \bullet x$, le stabilisateur $\mathrm{Stab}_G(x)$ et la transitivité d'une action, puis déterminer les orbites de l'action de $G = \{\mathrm{id}, s_{Ox}\}$ sur $\mathbb{S}^1$.`,
        solution: String.raw`Joyeux Noël ! $G \bullet x = \{g \bullet x \mid g \in G\}$, $\mathrm{Stab}_G(x) = \{g \in G \mid g \bullet x = x\}$, et l'action est transitive s'il n'y a qu'une seule orbite ($G \bullet x = X$). Sur $\mathbb{S}^1$, les orbites sont les singletons $\{1\}$ et $\{-1\}$, ainsi que les paires $\{e^{i\theta}, e^{-i\theta}\}$ pour $\theta \in ]0, \pi[$.`
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
        if (typeof window === 'undefined') return [];
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
                            <h2 id="avent-modal-title"><MathText content={selectedDay.titre} /></h2>

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
