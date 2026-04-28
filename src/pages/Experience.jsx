import React from 'react';
import NavBar from '../assets/components/NavBar';

function Experience() {
    return (
        <>
            <section className="Header">
                <NavBar background="bg-background" />
            </section>
            <div className="container">

                <section className="experience mt-lg-5">

                    <div className="row">
                        <div className="col-xs-12 col-lg-5 col-xxl-4 d-none d-lg-block">


                            <div className="diplomas mb-5 mt-5">

                                <div className="diploma-badge">
                                    <div className="tooltiptext">Double licence en cours de préparation</div>
                                    <div className="content">
                                        <img src={process.env.PUBLIC_URL + "/images/upc.jpeg"} alt="Baccalauréat" />
                                        Double licence Maths & Informatique <i className="far fa-hourglass iconTooltip" />
                                    </div>
                                </div>
                                <div className="diploma-badge">
                                    <div className="tooltiptext">Mention Très Bien avec Section Européenne (Anglais)</div>
                                    <div className="content">
                                        <img src={process.env.PUBLIC_URL + "/images/monod.jpeg"} alt="Baccalauréat" />
                                        Baccalauréat
                                    </div>
                                </div>
                                <div className="diploma-badge">
                                    <div className="tooltiptext">Obtenu en 2024</div>
                                    <div className="content">
                                        <img src={process.env.PUBLIC_URL + "/images/marianne.png"} alt="Baccalauréat" />
                                        Permis B
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-lg-5 ml5">
                            <h2 className="ps-lg-5">Formation</h2>
                            <div className="timeline ps-lg-5">
                                <div className="timeline-item">
                                    <div className="timeline-icon">
                                        <i className="fas fa-briefcase"></i>
                                    </div>
                                    <div className="timeline-content">
                                        <h3>Préparation du CAPES de Mathématiques</h3>
                                        <span className="date">Pour la session 2027</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <img src={process.env.PUBLIC_URL + "/images/upc.jpeg"} alt="Université Paris Cité" className="timeline-image" />
                                    <div className="timeline-content">
                                        <h3>Université Paris Cité</h3>
                                        <span className="date">2024 - Aujourd'hui</span>
                                        <p>
                                            Étudiant en double licence Maths & Informatique, préparation du CAPES de Mathématiques.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <h2 className="ps-lg-5">Expériences</h2>

                            <div className="timeline ps-lg-5">
                                <div className="timeline-item">
                                    <img src={process.env.PUBLIC_URL + "/images/wybz.png"} alt="Wybz" className="timeline-image past" />
                                    <div className="timeline-content">
                                        <h3 className="past">Fondateur de Wybz.Fr</h3>
                                        <span className="date">Février 2023 - Décembre 2025 (2 ans et 10 mois)</span>
                                        <p>
                                            Participation à la création de sites web responsables : éco-conçus, accessibles à tous et respectueux des utilisateurs.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <img src={process.env.PUBLIC_URL + "/images/pépite.png"} alt="Pépite CreaJ IDF" className="timeline-image past" />
                                    <div className="timeline-content">
                                        <h3 className="past">Etudiant-Entrepreneur au Pépite Creaj IDF</h3>
                                        <span className="date">Octobre 2024 - Décembre 2025 (1 an et 2 mois)</span>
                                        <p>
                                            Développement du projet Wybz.Fr à plus grande échelle au sein du Pépite Creaj IDF.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <img src={process.env.PUBLIC_URL + "/images/nddp.png"} alt="Pépite CreaJ IDF" className="timeline-image" />
                                    <div className="timeline-content">
                                        <h3>Bénévole d'accueil à Notre Dame de Paris</h3>
                                        <span className="date">Juillet 2025 - Aujourd'hui</span>
                                        <p>
                                            Accueil et médiation auprès des visiteurs dans la cathédrale, contribution à la redécouverte du monument après les travaux de restauration.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <img src={process.env.PUBLIC_URL + "/images/monod.jpeg"} alt="Pépite CreaJ IDF" className="timeline-image past" />
                                    <div className="timeline-content">
                                        <h3>Stage d'observation enseignant mathématiques</h3>
                                        <span className="date">Juin 2025</span>
                                        <p>
                                            Stage d'observation auprès d'enseignants de mathématiques dans un lycée, découverte du métier d'enseignant et partage de la passion pour les mathématiques.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <img src={process.env.PUBLIC_URL + "/images/csn.jpeg"} alt="CSN Monod" className="timeline-image past" />
                                    <div className="timeline-content">
                                        <h3 className="past">Président du CSN Monod</h3>
                                        <span className="date">Janvier 2023 - Juin 2024 (1 an et demi)</span>
                                        <p>Co-organisation de projets solidaires, sportifs et citoyens pour les élèves du lycée Gustave Monod, participation à la fondation du Conseil du Service National (CSN).</p>
                                    </div>
                                </div>
                                <div className="timeline-item mb-5">
                                    <img src={process.env.PUBLIC_URL + "/images/snu.jpg"} alt="CSN Monod" className="timeline-image past" />
                                    <div className="timeline-content">
                                        <h3 className="past">Service National Universel</h3>
                                        <span className="date">Juin 2022</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 col-lg-5 col-xxl-4 d-flex d-lg-none ml5" style={{ maxWidth: "95%" }}>


                            <div className="diplomas mb-5 mt-5">

                                <div className="diploma-badge">
                                    <div className="tooltiptext">Double licence en cours de préparation</div>
                                    <div className="content">
                                        <img src={process.env.PUBLIC_URL + "/images/upc.jpeg"} alt="Baccalauréat" />
                                        Double licence Maths & Informatique <i className="far fa-hourglass iconTooltip" />
                                    </div>
                                </div>
                                <div className="diploma-badge">
                                    <div className="tooltiptext">Mention Très Bien avec Section Européenne (Anglais)</div>
                                    <div className="content">
                                        <img src={process.env.PUBLIC_URL + "/images/monod.jpeg"} alt="Baccalauréat" />
                                        Baccalauréat
                                    </div>
                                </div>
                                <div className="diploma-badge">
                                    <div className="tooltiptext">Obtenu en 2024</div>
                                    <div className="content">
                                        <img src={process.env.PUBLIC_URL + "/images/marianne.png"} alt="Baccalauréat" />
                                        Permis B
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section >
            </div >
        </>
    );
}

export default Experience;