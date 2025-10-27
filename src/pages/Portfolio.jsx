import React, { useState } from 'react';
import NavBar from '../assets/components/NavBar';
import projects from '../assets/projects.json';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

function Portfolio() {
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
        <>
            <section className="Header">
                <NavBar home background="bg-background" />
            </section>

            <div className="scroll">
                <div className="scroll-text">Scroll</div>
                <div className="scroll-line"></div>
            </div>

            <section className="portfolio container">
                <h2 className="mb-4 mt-4">Projets</h2>

                <div className="project-folders">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="folder-card"
                            role="button"
                            tabIndex={0}
                            onClick={() => openProject(p)}
                            onKeyDown={(e) => e.key === 'Enter' && openProject(p)}
                            style={{
                                backgroundImage: p.images && p.images.length > 0 ? `url(${process.env.PUBLIC_URL + p.images[0]})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            <div className="folder-overlay">
                                <div className="folder-meta">
                                    <strong>{p.title}</strong>
                                    <span className="date">{p.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Drawer anchor="right" open={open} onClose={closeDrawer}>
                <Box sx={{ width: { xs: '100vw', sm: 520 }, p: 3 }} role="presentation">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Typography variant="h5">{selected?.title}</Typography>
                                        <Typography variant="caption" display="block" sx={{ color: '#666' }}>{selected?.date}</Typography>
                                    </div>
                                    <button className="close-btn" onClick={closeDrawer} aria-label="Fermer">&times;</button>
                                </div>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ color: '#333' }}>{selected?.intro}</Typography>
                    </Box>

                    {selected?.links && selected.links.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Liens</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                {selected.links.map((l, idx) => (
                                    <Chip
                                        key={idx}
                                        component="a"
                                        href={l.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        label={l.label}
                                        clickable
                                        icon={<span className="link-icon">🔗</span>}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {selected?.images && <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2">Galerie</Typography>

                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <div className="gallery-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <button
                                    className="gallery-arrow prev"
                                    onClick={prevImage}
                                    disabled={!selected || (selected.images || []).length <= 1}
                                    aria-label="Précédent"
                                >
                                    ‹
                                </button>
                                <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
                                    {selected && selected.images && selected.images.length > 0 ? (
                                        <img
                                            src={process.env.PUBLIC_URL + selected.images[galleryIndex]}
                                            alt={`${selected.title} ${galleryIndex + 1}`}
                                            style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                                        />
                                    ) : (
                                        <div style={{ padding: 40, background: '#f5f5f5', borderRadius: 8 }}>Aucune image</div>
                                    )}
                                </div>
                                <button
                                    className="gallery-arrow next"
                                    onClick={nextImage}
                                    disabled={!selected || (selected.images || []).length <= 1}
                                    aria-label="Suivant"
                                >
                                    ›
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 8 }}>
                                {selected?.images?.map((img, idx) => (
                                    <img
                                        key={img}
                                        src={process.env.PUBLIC_URL + img}
                                        alt={`${selected.title} thumb ${idx + 1}`}
                                        style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: idx === galleryIndex ? '2px solid black' : '2px solid transparent' }}
                                        onClick={() => setGalleryIndex(idx)}
                                    />
                                ))}
                            </div>
                        </Box>
                    </Box>}

                    {selected?.tags && <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2">Technos</Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            {selected?.tags?.map((t) => (
                                <Chip key={t} label={t} />
                            ))}
                        </Box>
                    </Box>}
                </Box>
            </Drawer>
        </>
    );
}

export default Portfolio;