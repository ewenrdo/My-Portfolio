import React from 'react';
import { NavLink } from 'react-router-dom';

class NavBar extends React.Component {
    render() {
        return (
            <>
                <nav className={this.props.home ? "navbar navbar-expand-lg fixed-top " + this.props.background : "navbar navbar-expand-lg " + this.props.background}>
                    <div className="container">
                        <NavLink className="navbar-brand" to="/">Ewen</NavLink>

                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuOffcanvas" aria-controls="menuOffcanvas">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/"><i className="fas fa-home" /></NavLink>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <NavLink className="nav-link" to="/experience">Expérience</NavLink>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <NavLink className="nav-link" to="/portfolio">Portfolio</NavLink>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <NavLink className="nav-link" to="/ressources">Ressources</NavLink>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <NavLink className="nav-link" to="/contact">Me contacter</NavLink>
                                </li>
                            </ul>
                            <div className="d-none d-lg-flex">
                                {"<Hey !/>"}
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="offcanvas offcanvas-end" tabIndex="-1" id="menuOffcanvas" aria-labelledby="menuOffcanvasLabel">
                    <div className="offcanvas-header">
                        <NavLink className="offcanvas-title navbar-brand" to="/">Ewen</NavLink>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item text-center">
                                <NavLink className="nav-link w-100 text-center" to="/" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-home" /></NavLink>
                            </li>
                            <li className="nav-item text-center">
                                <NavLink className="nav-link w-100 text-center" to="/experience" data-bs-dismiss="offcanvas" aria-label="Close">Expérience</NavLink>
                            </li>
                            <li className="nav-item text-center">
                                <NavLink className="nav-link w-100 text-center" to="/portfolio" data-bs-dismiss="offcanvas" aria-label="Close">Portfolio</NavLink>
                            </li>
                            <li className="nav-item text-center">
                                <NavLink className="nav-link w-100 text-center" to="/ressources" data-bs-dismiss="offcanvas" aria-label="Close">Ressources</NavLink>
                            </li>
                            <li className="nav-item text-center">
                                <NavLink className="nav-link w-100 text-center" to="/contact" data-bs-dismiss="offcanvas" aria-label="Close">Me contacter</NavLink>
                            </li>
                        </ul>
                    </div>
                    <div className="offcanvas-footer text-center pb-4">
                        2024 {new Date().getFullYear() > 2024 ? "-" + new Date().getFullYear() : ""} © Ewen Rodrigues de Oliveira
                    </div>
                </div>
            </>
        );
    }
}

// eslint-disable-next-line
export default NavBar;