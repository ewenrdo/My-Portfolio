import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

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
                                    <NavLink className="nav-link" to="/contact">Me contacter</NavLink>
                                </li>
                            </ul>
                            <div className="d-none d-lg-flex">
                                {"<Hey !/>"}
                            </div>
                        </div>
                    </div>
                </nav>

                <div class="offcanvas offcanvas-end" tabindex="-1" id="menuOffcanvas" aria-labelledby="menuOffcanvasLabel">
                    <div class="offcanvas-header">
                        <NavLink className="offcanvas-title navbar-brand" to="/">Ewen</NavLink>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item text-center">
                                <button className="nav-link w-100 text-center" to="/" data-bs-dismiss="offcanvas" aria-label="Close"onClick={() => this.props.navigate("/")}><i className="fas fa-home" /></button>
                            </li>
                            <li className="nav-item text-center">
                                <button className="nav-link w-100 text-center" to="/experience" data-bs-dismiss="offcanvas" aria-label="Close"
                                    onClick={() => this.props.navigate("/experience")}
                                >Expérience</button>
                            </li>
                            <li className="nav-item text-center">
                                <button className="nav-link w-100 text-center" to="/portfolio" data-bs-dismiss="offcanvas" aria-label="Close"
                                    onClick={() => this.props.navigate("/portfolio")}
                                >Portfolio</button>
                            </li>
                            <li className="nav-item text-center">
                                <button className="nav-link w-100 text-center" to="/contact" data-bs-dismiss="offcanvas" aria-label="Close"
                                    onClick={() => this.props.navigate("/contact")}
                                >Me contacter</button>
                            </li>
                        </ul>
                    </div>
                    <div class="offcanvas-footer text-center pb-4">
                        2024 {new Date().getFullYear() > 2024 ? "-" + new Date().getFullYear() : ""} © Ewen Rodrigues de Oliveira
                    </div>
                </div>
            </>
        );
    }
}

// eslint-disable-next-line
export default (props) => <NavBar {...props} navigate={useNavigate()} />;