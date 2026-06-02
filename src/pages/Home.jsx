import React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import DockNav from '../assets/components/DockNav';

function Home() {
    const [showAllExperiences, setShowAllExperiences] = useState(false);

    const highlights = [
        {
            label: "Actuel",
            title: "Double licence Maths & Informatique",
            text: "J’avance entre logique, rigueur et création. Mon quotidien mélange cours, autonomie et projets concrets."
        },
        {
            label: "Cap",
            title: "Préparation du CAPES de Mathématiques",
            text: "Je garde un fil conducteur clair: transmettre, structurer et donner du sens à ce que j’apprends."
        }
    ];

    const experiences = [
        {
            status: "current",
            period: "2024 - aujourd'hui",
            title: "Université Paris Cité",
            meta: "Double licence Maths & Informatique",
            text: "Préparation de deux licences en parallèle en mathématiques et en informatique fondamentale."
        },
        {
            status: "current",
            period: "Pour la session 2027",
            title: "CAPES de Mathématiques",
            meta: "Objectif d’enseignement",
            text: "Une direction claire: transmettre, expliquer et structurer des idées complexes de façon accessible."
        },
        {
            status: "current",
            period: "Juillet 2025 - aujourd'hui",
            title: "Notre-Dame de Paris",
            meta: "Bénévole d'accueil",
            text: "Accueil, médiation et relation au public dans un lieu emblématique, avec une vraie exigence d'écoute et de patience."
        },
        {
            status: "past",
            period: "Février 2023 - Décembre 2025",
            title: "Wybz.Fr",
            meta: "Fondateur",
            text: "Création de sites web responsables, éco-conçus et pensés pour être utiles, rapides et accessibles."
        },
        {
            status: "past",
            period: "Octobre 2024 - Décembre 2025",
            title: "Pépite Creaj IDF",
            meta: "Étudiant-entrepreneur",
            text: "Un cadre pour faire grandir Wybz.Fr, confronter l’idée au réel et apprendre à l’échelle d’un projet."
        },
        {
            status: "past",
            period: "Juin 2025",
            title: "Stage d'observation",
            meta: "Mathématiques au lycée Gustave Monod",
            text: "Découverte du métier d’enseignant, immersion pédagogique et regard concret sur la transmission."
        },
        {
            status: "past",
            period: "Janvier 2023 - Juin 2024",
            title: "CSN Monod",
            meta: "Président",
            text: "Co-organisation de projets solidaires, sportifs et citoyens, avec un rôle de coordination réel."
        },
        {
            status: "past",
            period: "Juin 2022",
            title: "Service National Universel",
            meta: "Point de départ collectif",
            text: "Une première expérience structurante autour du collectif, du service et du sens des responsabilités."
        }
    ];

    return (
        <div className="Home">
            <section className="Header">
                <DockNav />

                <div className="hero">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 col-lg-5 col-xxl-4">
                                <div className="avatar">
                                    <img src={process.env.PUBLIC_URL + "/images/photo.jpg"} alt="Ewen Rodrigues" className="profile-picture" />
                                    <img src={process.env.PUBLIC_URL + "/images/panda.avif"} alt="@funoxpanda" className="profile-picture-hover" />
                                </div>
                                <h1>{new Date().getHours() < 18 ? "Bonjour" : "Bonsoir"}, je suis Ewen Rodrigues de Oliveira <div className="tooltipHint">👋<span className="tooltiptext">"Rodrigues" avec un "s", pas un "z"</span></div></h1>


                                <div className="diplomas d-lg-flex d-none">

                                    <div className="diploma-badge">
                                        <div className="tooltiptext">Double licence en cours de préparation</div>
                                        <div className="content">
                                            <img src={process.env.PUBLIC_URL + "/images/upc.jpeg"} alt="Université Paris Cité" />
                                            Double licence Maths & Informatique <i className="far fa-hourglass iconTooltip" />
                                        </div>
                                    </div>

                                </div>

                                <a className="hero-scroll-indicator" href="#presentation" aria-label="Aller à la présentation">
                                    <i className="fas fa-chevron-down" />
                                </a>

                            </div>

                            <div className="col-xs-12 col-lg-7 col-xxl-8 ps-lg-5">
                                <div className="presentation" id="home-presentation">
                                    <h2>Étudiant en Mathématiques et Informatique</h2>
                                    <span className="description">Développeur à mes heures perdues, et étudiant le plus souvent (même en rêves).<br />Je prépare une double licence et le CAPES de Mathématiques.</span>

                                    <div className="cta-section">
                                        <NavLink className="btn btn-black mb-2" to="/contact">Me contacter</NavLink>
                                        <NavLink className="btn btn-outline-black" to="/portfolio">Découvrir mes projets</NavLink>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="experience experience-home" id="presentation">
                <div className="container experience-main">
                    <section className="experience-hero">
                        <div className="experience-hero-copy">
                            <span className="experience-kicker">
                                <i className="fas fa-wave-square" />
                                Parcours en construction continue
                            </span>
                            <h1>Une lecture plus vivante de mon parcours</h1>
                            <p>
                                J’ai voulu sortir du déroulé linéaire pour montrer mon évolution comme un ensemble de directions qui se
                                répondent: apprendre, transmettre, construire et servir, sans tout réduire à une simple liste.
                            </p>
                        </div>

                        <div className="experience-hero-panel">
                            <div className="experience-panel-intro">
                                <span className="experience-panel-kicker">Repères clés</span>
                                <h2>Un parcours qui relie savoir, projet et relation humaine</h2>
                                <p>
                                    Chaque étape a ajouté une compétence différente, mais elles racontent toutes la même manière de voir le monde.
                                </p>
                            </div>

                            <div className="experience-panel-band">
                                <div className="panel-band-item">
                                    <span className="panel-band-label">En cours</span>
                                    <strong>Double licence + CAPES</strong>
                                </div>
                                <div className="panel-band-item">
                                    <span className="panel-band-label">Expériences</span>
                                    <strong>Projet, accueil, coordination</strong>
                                </div>
                            </div>
                        </div>

                    </section>

                    <section className="experience-mosaic">
                        <div className="experience-orbit">
                            <div className="orbit-core">
                                <span>Parcours</span>
                                <strong>Maths · Tech · Engagement</strong>
                            </div>
                        </div>

                        {highlights.map((item, index) => (
                            <article className={`experience-card card-${index + 1}`} key={item.title}>
                                <span className="card-label">{item.label}</span>
                                <h2>{item.title}</h2>
                                <p>{item.text}</p>
                            </article>
                        ))}

                        <article className="experience-card card-side">
                            <div className="card-side-copy">
                                <span className="card-label">Fil rouge</span>
                                <h2>Mes expériences, en lecture directe</h2>
                                <p>
                                    Le fil rouge est simple: comprendre, structurer, agir et transmettre. Voici les étapes qui composent
                                    ce parcours, formulées pour être lues d’un coup d’œil.
                                </p>
                                <div className="card-side-social">
                                    <Link to="https://www.linkedin.com/in/ewen-rodrigues-de-oliveira-500736267/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                        <i className="fab fa-linkedin" />
                                    </Link>
                                    <Link to="mailto:contact@ewenrdo.fr" target="_blank" rel="noopener noreferrer" aria-label="Email">
                                        <i className="fas fa-envelope" />
                                    </Link>
                                </div>
                            </div>

                            <div className="experience-thread-grid" aria-label="Repères du parcours">
                                {experiences.slice(0, showAllExperiences ? experiences.length : 4).map((experience) => (
                                    <div className={`thread-item thread-item-${experience.status}`} key={experience.title}>
                                        <span className="thread-period">{experience.period}</span>
                                        <h3>{experience.title}</h3>
                                        <span className="thread-meta">{experience.meta}</span>
                                        <p>{experience.text}</p>
                                    </div>
                                ))}
                            </div>

                            {experiences.length > 4 && (
                                <button
                                    type="button"
                                    className="experience-thread-toggle"
                                    onClick={() => setShowAllExperiences((value) => !value)}
                                >
                                    {showAllExperiences ? 'Réduire le fil rouge' : 'Déployer toutes les expériences'}
                                    <i className={`fas fa-chevron-${showAllExperiences ? 'up' : 'down'}`} />
                                </button>
                            )}
                        </article>
                    </section>
                </div>
            </section>
        </div>
    );
}

export default Home;