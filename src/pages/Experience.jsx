import React from 'react';
import NavBar from '../assets/components/NavBar';

class Experience extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "N/A",
            isLoading: true,
            establishmentInfos: [],
            registrations: [],
        };

        this.expRef = React.createRef();
    }

    componentDidMount() {
        //
    }

    render() {
        return (
            <>
                <section className="Header">
                    <NavBar background="bg-background" />
                </section>
                <div className="container">

                    <section className="experience mt-lg-5" ref={this.expRef}>

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
                                            Baccaulauréat
                                        </div>
                                    </div>
                                    <div className="diploma-badge">
                                        <div className="tooltiptext">Obtenu en 2024</div>
                                        <div className="content">
                                            <img src={process.env.PUBLIC_URL + "/images/marianne.png"} alt="Baccalauréat" />
                                            Permis B
                                        </div>
                                    </div>
                                    <div className="diploma-badge">
                                        <div className="tooltiptext">Statut National d'Etudiant-Entrepreneur</div>
                                        <div className="content">
                                            <img src={process.env.PUBLIC_URL + "/images/pépite.png"} alt="Pépite" />
                                            SNEE
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xs-12 col-lg-5 ml5">
                                <h2 className="ps-lg-5">Expériences</h2>

                                <div className="timeline ps-lg-5">
                                    {/*<div className="timeline-item">
                                        <div className="timeline-icon">
                                            <i className="fas fa-briefcase"></i>
                                        </div>
                                        <div className="timeline-content">
                                            <h3>Professeur particulier de mathématiques</h3>
                                            <span className="date">Dès septembre 2024</span>
                                        </div>
                                    </div>*/}
                                    <div className="timeline-item">
                                        <img src={process.env.PUBLIC_URL + "/images/pépite.png"} alt="Pépite CreaJ IDF" className="timeline-image" />
                                        <div className="timeline-content">
                                            <h3>Etudiant-Entrepreneur au Pépite Creaj IDF</h3>
                                            <span className="date">Octobre 2024 - Aujourd'hui</span>
                                            <p>
                                                J'ai rejoint le Pépite Creaj IDF pour développer mon projet à plus grande échelle, Naxalian Studios.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <img src={process.env.PUBLIC_URL + "/images/naxalian.png"} alt="Naxalian Studios" className="timeline-image" />
                                        <div className="timeline-content">
                                            <h3>Fondateur de Naxalian.Fr</h3>
                                            <span className="date">Février 2023 - Aujourd'hui</span>
                                            <p>
                                                Je participe à la création de sites web responsables : éco-conçus, accessibles à tous et respectueux des utilisateurs.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <img src={process.env.PUBLIC_URL + "/images/csn.jpeg"} alt="CSN Monod" className="timeline-image" />
                                        <div className="timeline-content">
                                            <h3>Président du CSN Monod</h3>
                                            <span className="date">Janvier 2023 - Juin 2024 (1 an et demi)</span>
                                            <p>Organisation de projets solidaires, sportifs et citoyens pour les élèves du lycée Gustave Monod. J'ai participé à la fondation du Conseil du Service National (CSN).</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item mb-5">
                                        <img src={process.env.PUBLIC_URL + "/images/snu.jpg"} alt="CSN Monod" className="timeline-image" />
                                        <div className="timeline-content">
                                            <h3>Service National Universel</h3>
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
                                            Baccaulauréat
                                        </div>
                                    </div>
                                    <div className="diploma-badge">
                                        <div className="tooltiptext">Obtenu en 2024</div>
                                        <div className="content">
                                            <img src={process.env.PUBLIC_URL + "/images/marianne.png"} alt="Baccalauréat" />
                                            Permis B
                                        </div>
                                    </div>
                                    <div className="diploma-badge">
                                        <div className="tooltiptext">Statut National d'Etudiant-Entrepreneur</div>
                                        <div className="content">
                                            <img src={process.env.PUBLIC_URL + "/images/pépite.png"} alt="Pépite" />
                                            SNEE
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

}

export default Experience;