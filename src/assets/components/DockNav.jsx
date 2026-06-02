import React from 'react';
import { NavLink } from 'react-router-dom';

function DockNav() {
    const links = [
        { to: '/', label: 'Home', icon: 'fas fa-home' },
        { to: '/portfolio', label: 'Portfolio', icon: 'fas fa-folder-open' },
        { to: '/ressources', label: 'Ressources', icon: 'fas fa-book-open' },
    ];

    return (
        <div className="dock-nav">
            <div className="container">
                <div className="dock-nav-shell">
                    <nav className="dock-nav-list" aria-label="Navigation principale">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `dock-nav-link${isActive ? ' is-active' : ''}`}
                            >
                                <i className={link.icon} aria-hidden="true" />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default DockNav;