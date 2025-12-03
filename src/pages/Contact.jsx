import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../assets/components/NavBar';

class Contact extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "N/A",
            isLoading: true,
            establishmentInfos: [],
            registrations: [],
            reason: null
        };

        this.expRef = React.createRef();
    }
    
    render() {
        return (
            <div className="Home">
                <section className="Header">
                    <NavBar home background="bg-white" />

                    <div className="hero">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 col-lg-5 col-xxl-4">
                                    <div className="avatar">
                                        <img src={process.env.PUBLIC_URL + "/images/photo.jpg"} alt="Ewen Rodrigues" className="profile-picture" />
                                        <img src={process.env.PUBLIC_URL + "/images/panda.avif"} alt="@funoxpanda" className="profile-picture-hover" />
                                    </div>
                                    <h1>Et si nous prenions contact {new Date().getHours() < 18 ? "aujourd'hui" : "ce soir"} ? {new Date().getHours() >= 18 ? <div className="tooltipHint">😴<span className="tooltiptext">Je ne répondrai peut-être pas dans la soirée</span></div> : null}</h1>

                                    <p className="mt-3 d-none d-lg-flex">
                                        Il arrive que mon téléphone soit en mode "ne pas déranger" pour me concentrer sur mes projets, mais je réponds toujours aux messages dans les plus brefs délais.<br/>
                                    </p>

                                </div>

                                <div className="col-xs-12 col-lg-7 col-xxl-8 ps-lg-5">
                                    {!this.state.reason ?
                                        <div className="presentation align-items-top">
                                            <h2>Choisissez la catégorie qui vous intéresse</h2>

                                            <div className="cta-section mb-3">
                                                {/*<button className="btn btn-black mb-2" onClick={() => this.setState({ reason: "scolar" })} disabled={new Date().getTime() < new Date("2024-08-15T00:00:00Z").getTime()}>Accompagnement scolaire</button>*/}
                                                <Link to="https://www.linkedin.com/in/ewen-rodrigues-de-oliveira-500736267/" target="_blank" className="btn btn-black mb-2">Mon LinkedIn</Link>
                                                <button className="btn btn-black mb-2" onClick={() => this.setState({ reason: "website" })}>Demande de site web</button>
                                                <button className="btn btn-black" onClick={() => this.setState({ reason: "other" })}>Autre</button>
                                            </div>

                                            <span className="text-danger">
                                                
                                            </span>
                                        </div>
                                        : this.state.reason === "website" ?

                                            <div className="presentation align-items-top">
                                                <h2>Vous souhaitez me contacter pour un site web ?</h2>

                                                <p className="mt-3 m-0">
                                                    Vous avez un projet de site web ? Vous avez besoin d'un développeur web pour vous aider à réaliser votre projet ? Vous êtes au bon endroit !<br />
                                                    Je suis développeur web NodeJS et ReactJS et je serais ravi de vous aider à réaliser votre projet.<br /><br />

                                                    Contactez-moi dès maintenant pour discuter de votre projet sur Discord <b>(@funoxpanda)</b> ou par e-mail à <b>ewen.rdo@naxalian.fr</b>.
                                                </p>

                                                <div className="cta-section">
                                                    <Link to="mailto:ewen.rdo@naxalian.fr" className="btn btn-black mb-2">Envoyer un e-mail</Link>
                                                    <button className="btn btn-outline-black mb-2" onClick={() => this.setState({ reason: null })}>Retour</button>
                                                </div>

                                            </div>
                                            /*: this.state.reason === "scolar" ?

                                                <div className="presentation align-items-top">
                                                    <h2>Vous souhaitez avoir un accompagnement en mathématiques pour les lycéens ?</h2>


                                                    <p className="mt-3 m-0">
                                                        Voici les tarifs pour les cours particuliers de mathématiques :
                                                        <ul>
                                                            <li>Cours en visioconférence : 30€/h (idéal pour TD, et réponses à des questions ponctuelles)</li>
                                                            <li>Cours à domicile : 40€/h (idéal pour des cours complets) <span className="soon">Bientôt</span></li>
                                                            <li>Forfait annuel : 1 séance par semaine
                                                                <br />- 10€ de réduction par séance
                                                                <br />- Idéal pour un suivi régulier et une progression pour le baccalauréat
                                                                <br />- Numéro de téléphone pour des questions ponctuelles 7j/7
                                                            </li>
                                                        </ul>
                                                    </p>
                                                    <div className="cta-section">
                                                        <Link to="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0G_RKgfvE1zoXJiOwPBMqpEHKz4i9kDxYa-T9LMoh2npL7OtupDvlw9nnILl7G0slL9URUJR-D" className="btn btn-black mb-2">Réserver un créneau</Link>
                                                        <button className="btn btn-outline-black mb-2" onClick={() => this.setState({ reason: null })}>Retour</button>
                                                    </div>

                                                </div>*/
                                                : this.state.reason === "other" ?
                                                    <div className="presentation align-items-top">
                                                        <h2>Vous avez une autre demande ?</h2>

                                                        <p className="mt-3 m-0">
                                                            Vous avez une autre demande ? Vous souhaitez me contacter pour un autre sujet ? N'hésitez pas à m'envoyer un e-mail à <b>ewen.rdo@naxalian.fr</b> ou à me contacter sur Discord <b>(@funoxpanda)</b>.
                                                        </p>

                                                        <div className="cta-section">
                                                            <Link to="mailto:ewen.rdo@naxalian.fr" className="btn btn-black mb-2">Envoyer un e-mail</Link>
                                                            <button className="btn btn-outline-black mb-2" onClick={() => this.setState({ reason: null })}>Retour</button>
                                                        </div>
                                                    </div>
                                                    : null}


                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );

    }

}

export default Contact;