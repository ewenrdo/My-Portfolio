'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavBar({ home, background }) {

    const location = usePathname();

    useEffect(() => {
        const offcanvasEl = document.getElementById('menuOffcanvas');
        if (offcanvasEl) {
            const offcanvasInstance = window.bootstrap?.Offcanvas.getInstance(offcanvasEl);
            offcanvasInstance?.hide();
        }
    }, [location]);

    return (
        <>
            <nav className={home ? "navbar navbar-expand-lg fixed-top " + background : "navbar navbar-expand-lg " + background}>
                    <div className="container">
                        <Link className="navbar-brand" href="/">Ewen</Link>

                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#menuOffcanvas" aria-controls="menuOffcanvas">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" href="/"><i className="fas fa-home" /></Link>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <Link className="nav-link" href="/experience">Expérience</Link>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <Link className="nav-link" href="/experience2">Experience2</Link>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <Link className="nav-link" href="/portfolio">Portfolio</Link>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <Link className="nav-link" href="/ressources">Ressources</Link>
                                </li>
                                <li className="nav-item ms-lg-3">
                                    <Link className="nav-link" href="/contact">Me contacter</Link>
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
                        <Link className="offcanvas-title navbar-brand" href="/">Ewen</Link>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item text-center">
                                <Link className="nav-link w-100 text-center" href="/" ><i className="fas fa-home" /></Link>
                            </li>
                            <li className="nav-item text-center">
                                <Link className="nav-link w-100 text-center" href="/experience" >Expérience</Link>
                            </li>
                            <li className="nav-item text-center">
                                <Link className="nav-link w-100 text-center" href="/experience2" >Experience2</Link>
                            </li>
                            <li className="nav-item text-center">
                                <Link className="nav-link w-100 text-center" href="/portfolio" >Portfolio</Link>
                            </li>
                            <li className="nav-item text-center">
                                <Link className="nav-link w-100 text-center" href="/ressources" >Ressources</Link>
                            </li>
                            <li className="nav-item text-center">
                                <Link className="nav-link w-100 text-center" href="/contact" >Me contacter</Link>
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

export default NavBar;
