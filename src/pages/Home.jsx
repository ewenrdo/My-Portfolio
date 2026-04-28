import React from 'react';
import { NavLink } from 'react-router-dom';
import NavBar from '../assets/components/NavBar';

function Home() {
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
                                    <h1>{new Date().getHours() < 18 ? "Bonjour" : "Bonsoir"}, je suis Ewen Rodrigues de Oliveira <div className="tooltipHint">👋<span className="tooltiptext">"Rodrigues" avec un "s", pas un "z"</span></div></h1>


                                    <div className="diplomas d-lg-flex d-none">

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

                                <div className="col-xs-12 col-lg-7 col-xxl-8 ps-lg-5">
                                    <div className="presentation">
                                        <h2>Étudiant en Mathématiques et Informatique</h2>
                                        <span className="description">Passionné depuis toujours par l'informatique, et encore plus par les maths</span>

                                        <div className="cta-section">
                                            <NavLink className="btn btn-black mb-2" to="/contact">Me contacter</NavLink>
                                            <NavLink className="btn btn-outline-black" to="/experience">Découvrir mon expérience</NavLink>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
}

export default Home;