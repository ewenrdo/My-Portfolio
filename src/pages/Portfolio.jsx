import React, { useState, useEffect } from 'react';
import DockNav from '../assets/components/DockNav';
import projects from '../assets/projects.json';
import '../assets/stylesheets/portfolio.scss';

// --- COMPOSANT INTERNE : AppleDrawer ---
function AppleDrawer({ open, onClose, selected, galleryIndex, setGalleryIndex, prevImage, nextImage }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open || !selected) return null;

    const hasImages = selected.images && selected.images.length > 0;

    return (
        <div className="apple-drawer-overlay" onClick={onClose}>
            <div className="apple-drawer-panel" onClick={(e) => e.stopPropagation()}>
                <header className="apple-drawer-header">
                    <div className="drawer-header-left">
                        <h2>{selected.title}</h2>
                        <span className="drawer-date">{selected.date}</span>
                    </div>
                    <button onClick={onClose} className="drawer-close-btn" aria-label="Fermer le tiroir">
                        <i className="fas fa-times" />
                    </button>
                </header>

                <div className="apple-drawer-body">
                    {/* SECTION : PRÉSENTATION */}
                    <section className="drawer-section">
                        <h3 className="section-title">Présentation</h3>
                        <p className="intro-paragraph">{selected.intro}</p>
                    </section>

                    {/* SECTION : LIENS */}
                    {selected.links && selected.links.length > 0 && (
                        <section className="drawer-section">
                            <h3 className="section-title">Liens</h3>
                            <div className="chips-row">
                                {selected.links.map((l, idx) => (
                                    <a
                                        key={idx}
                                        href={l.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="apple-chip-link"
                                    >
                                        <span>🔗</span>
                                        {l.label}
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SECTION : GALERIE */}
                    <section className="drawer-section">
                        <h3 className="section-title">Galerie</h3>
                        <div className="apple-gallery-container">
                            <div className="apple-gallery-viewer">
                                <button
                                    type="button"
                                    className="gallery-arrow-btn prev"
                                    onClick={prevImage}
                                    disabled={!hasImages || selected.images.length <= 1}
                                    aria-label="Image précédente"
                                >
                                    <i className="fas fa-chevron-left" />
                                </button>

                                {hasImages ? (
                                    <img
                                        src={process.env.PUBLIC_URL + selected.images[galleryIndex]}
                                        alt={`${selected.title} ${galleryIndex + 1}`}
                                        onError={(e) => {
                                            e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg width='320' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f1f1f1'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='14' fill='%23888' text-anchor='middle' dy='.3em'%3EAperçu du projet%3C/text%3E%3C/svg%3E";
                                        }}
                                    />
                                ) : (
                                    <div style={{ padding: 40, color: 'rgba(0,0,0,0.3)', fontWeight: 500, fontSize: '0.9rem' }}>
                                        Aucune image disponible
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="gallery-arrow-btn next"
                                    onClick={nextImage}
                                    disabled={!hasImages || selected.images.length <= 1}
                                    aria-label="Image suivante"
                                >
                                    <i className="fas fa-chevron-right" />
                                </button>
                            </div>

                            {/* Vignettes de la galerie */}
                            {hasImages && selected.images.length > 1 && (
                                <div className="apple-gallery-thumbs">
                                    {selected.images.map((img, idx) => (
                                        <button
                                            key={img}
                                            type="button"
                                            className={`thumb-btn ${idx === galleryIndex ? 'is-active' : ''}`}
                                            onClick={() => setGalleryIndex(idx)}
                                        >
                                            <img 
                                                src={process.env.PUBLIC_URL + img} 
                                                alt={`Vignette ${idx + 1}`} 
                                                onError={(e) => {
                                                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg width='72' height='48' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23ddd'/%3E%3C/svg%3E";
                                                }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SECTION : TECHNOLOGIES */}
                    {selected.tags && selected.tags.length > 0 && (
                        <section className="drawer-section">
                            <h3 className="section-title">Technologies</h3>
                            <div className="chips-row">
                                {selected.tags.map((t) => (
                                    <span key={t} className="apple-chip-tag">{t}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Portfolio() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [galleryIndex, setGalleryIndex] = useState(0);

    function openProject(project) {
        setSelected(project);
        setGalleryIndex(0);
        setOpen(true);
    }

    function closeDrawer() {
        setOpen(false);
        setSelected(null);
    }

    function prevImage() {
        if (!selected || !selected.images || selected.images.length === 0) return;
        setGalleryIndex((i) => (i - 1 + selected.images.length) % selected.images.length);
    }

    function nextImage() {
        if (!selected || !selected.images || selected.images.length === 0) return;
        setGalleryIndex((i) => (i + 1) % selected.images.length);
    }

    return (
        <div className="portfolio-page">
            <div className="scroll-indicator-apple">
                <span>Défiler</span>
                <div className="scroll-line-fill" />
            </div>

            <main className="portfolio-shell">
                <section className="portfolio-shell-copy">
                    <span className="portfolio-kicker">PORTFOLIO</span>
                    <h1>Mes Projets & Réalisations</h1>
                    <p>
                        Découvrez mes projets universitaires, professionnels et personnels. Cliquez sur une carte pour explorer les détails et les technologies utilisées.
                    </p>
                </section>

                <div className="project-folders-grid">
                    {projects.map((p) => {
                        const hasCover = p.images && p.images.length > 0;
                        return (
                            <button
                                key={p.id}
                                className="folder-card-apple"
                                type="button"
                                onClick={() => openProject(p)}
                                style={{
                                    backgroundImage: hasCover 
                                        ? `url(${process.env.PUBLIC_URL + p.images[0]})` 
                                        : undefined,
                                }}
                            >
                                <div className="folder-overlay-content">
                                    <div className="folder-text-meta">
                                        <strong>{p.title}</strong>
                                        <span className="date">{p.date}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </main>

            <DockNav />

            {/* Panneau latéral Apple Drawer */}
            <AppleDrawer
                open={open}
                onClose={closeDrawer}
                selected={selected}
                galleryIndex={galleryIndex}
                setGalleryIndex={setGalleryIndex}
                prevImage={prevImage}
                nextImage={nextImage}
            />
        </div>
    );
}