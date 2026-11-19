'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function DockNav() {
    const pathname = usePathname();
    const links = [
        { to: '/', label: 'Accueil', icon: 'fas fa-home' },
        { to: '/portfolio', label: 'Portfolio', icon: 'fas fa-folder-open' },
        { to: '/ressources', label: 'Ressources', icon: 'fas fa-book-open' },
    ];

    return (
        <div className="dock-nav">
            <div className="container">
                <div className="dock-nav-shell">
                    <nav className="dock-nav-list" aria-label="Navigation principale">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                href={link.to}
                                className={`dock-nav-link${pathname === link.to ? ' is-active' : ''}`}
                            >
                                <i className={link.icon} aria-hidden="true" />
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default DockNav;
