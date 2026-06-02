import React, { useState } from 'react';
import DockNav from '../assets/components/DockNav';
import projects from '../assets/projects.json';
import '../assets/stylesheets/portfolio.scss';
import AppleDrawer from '../assets/components/AppleDrawer';

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