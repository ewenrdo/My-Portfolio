import React, { useState, useEffect, useRef } from 'react';
import BlurForm from '../componant/BlurForm';
import NavBar from '../assets/components/NavBar';
import TreeNode from '../assets/components/TreeNode';

export default function Ressources() {
    const [tree, setTree] = useState([]);
    const [selected, setSelected] = useState(null);
    const [formOpen, setFormOpen] = useState(true);
    const [formFilled, setFormFilled] = useState(false);
    const viewerRef = useRef(null);

    // Vérifie si le formulaire a été rempli dans les dernières 24h
    useEffect(() => {
        const filled = localStorage.getItem('formFilled');
        const filledTime = localStorage.getItem('formFilledTime');
        if (filled === 'true' && filledTime) {
            const now = Date.now();
            if (now - parseInt(filledTime, 10) < 2 * 24 * 60 * 60 * 1000) {
                setFormFilled(true);
            } else {
                localStorage.removeItem('formFilled');
                localStorage.removeItem('formFilledTime');
            }
        }
    }, []);

    // Charger le ressources.json externe
    // TODO : À l'avenir, le synchroniser avec une base de données / GitHub.
    function fetchSamples() {
        const url = '/ressources.json?v=' + new Date().getTime(); // évite le cache
        return fetch(url)
            .then((res) => res.json())
            .catch(() => []);
    }

    useEffect(() => {
        fetchSamples().then(setTree);
    }, []);

    // Scroll vers le haut de resource-viewer quand un fichier est sélectionné
    useEffect(() => {
        if (selected && viewerRef.current) {
            viewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selected]);

    // Callback quand le formulaire est rempli
    const handleFormFilled = () => {
        setFormOpen(false);
        setFormFilled(true);
        localStorage.setItem('formFilled', 'true');
        localStorage.setItem('formFilledTime', Date.now().toString());
    };

    return (
        <>
            <BlurForm open={formOpen && !formFilled} onClose={handleFormFilled} />
            <section className="Header">
                <NavBar background="bg-background" />
            </section>
            <div className="container">
                <section className="ressources mt-lg-5">
                    <h2 className="mb-4 mt-4" style={{ fontFamily: 'Aleo, serif', fontWeight: 700 }}>Ressources</h2>

                    <div className="row">
                        <div className="col-xs-12 col-lg-4">
                            <div className="resource-tree">
                                {tree.map((node, i) => (
                                    <TreeNode key={i} node={node} onSelect={setSelected} level={0} />
                                ))}
                            </div>
                        </div>
                        <div className="col-xs-12 col-lg-8">
                            <div className="resource-viewer" ref={viewerRef}>
                                {selected ? (
                                    (() => {
                                        // Vérification PDF
                                        const isPdf = selected.path && selected.path.toLowerCase().endsWith('.pdf');
                                        // Vérification crédits
                                        const hasCredits = selected.credits && selected.credits.trim() !== '';
                                        // Vérification date
                                        const hasDate = selected.date && selected.date.trim() !== '';
                                        if (!isPdf) {
                                            return (
                                                <div className="resource-error" style={{ textAlign: 'center', padding: '4rem 0' }}>
                                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#d32f2f', marginBottom: 16 }} />
                                                    <p style={{ color: '#d32f2f', fontWeight: 600, fontSize: '1.2rem' }}>Ce fichier n'est pas un PDF ou le chemin est invalide.</p>
                                                    <p style={{ color: '#888', fontSize: '1rem', marginTop: 12 }}>
                                                        Il est possible que le fichier ne soit pas encore (ou plus) disponible.<br/>
                                                        Besoin de cette ressource ? <a href="/contact" style={{ color: '#888', textDecoration: 'underline' }}>Me contacter</a>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div className="resource-meta">
                                                <div className="resource-meta-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <h3 style={{ fontFamily: 'Aleo, serif', fontWeight: 700, marginBottom: 0 }}>{selected.title}</h3>
                                                    <a
                                                        href={selected.path}
                                                        download
                                                        className="btn btn-outline-black"
                                                        style={{ marginLeft: 16, fontSize: '1rem', padding: '0.45rem 1.1rem', borderRadius: '2rem', border: '1px solid black', background: 'transparent', color: 'black', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                                                    >
                                                        <i className="fas fa-download" style={{ marginRight: 6 }} /> Télécharger
                                                    </a>
                                                </div>
                                                <p>{selected.comment}</p>
                                                {hasDate ? (
                                                    <p className="date">Modifié la dernière fois le <i>{selected.date}</i></p>
                                                ) : (
                                                    <p className="date" style={{ color: '#d32f2f' }}><i className="fas fa-exclamation-circle" style={{ marginRight: 6 }} />Date de modification manquante</p>
                                                )}
                                                {hasCredits && (
                                                    <p className="date"><strong>Crédits :</strong> {selected.credits}</p>
                                                )}
                                                <iframe
                                                    src={selected.path}
                                                    title={selected.title}
                                                    width="100%"
                                                    height="600px"
                                                    style={{ border: '1px solid #222', borderRadius: '0.5rem', marginTop: 16, background: '#fff' }}
                                                />
                                            </div>
                                        );
                                    })()
                                ) : (
                                    <div className="resource-placeholder">
                                        <p style={{ color: '#888', fontStyle: 'italic', marginTop: '4rem' }}>Sélectionnez un document pour l'afficher.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
