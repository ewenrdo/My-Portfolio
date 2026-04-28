import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ModalRevision from '../componant/ModalRevision';
import UpdateRevision from '../componant/UpdateRevision';
import BlurForm from '../componant/BlurForm';
import NavBar from '../assets/components/NavBar';
import TreeNode from '../assets/components/TreeNode';
import { NavLink } from 'react-router-dom';

export default function Ressources() {
    const [tree, setTree] = useState([]);
    const [selected, setSelected] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [formFilled, setFormFilled] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);
    const [search, setSearch] = useState("");
    const [openFolders, setOpenFolders] = useState([]); // tableau de slugs ouverts
    const viewerRef = useRef(null);
    const location = useLocation();

    // Recherche récursive d'un noeud (fichier ou dossier) par son slug
    function findNodeBySlug(nodes, slug, path = []) {
        for (const node of nodes) {
            if (node.slug === slug) {
                return { node, path: [...path, node] };
            }
            if (node.children && Array.isArray(node.children)) {
                const found = findNodeBySlug(node.children, slug, [...path, node]);
                if (found) return found;
            }
        }
        return null;
    }
    // Recherche récursive de tous les fichiers (objets avec 'path' et sans 'children') correspondant au terme
    function searchFiles(nodes, term) {
        let results = [];
        nodes.forEach(node => {
            const isFile = node.path && !node.children;
            if (isFile) {
                const label = node.title || node.name || '';
                if (label.toLowerCase().includes(term.toLowerCase())) {
                    results.push(node);
                }
            }
            if (node.children && Array.isArray(node.children)) {
                results = results.concat(searchFiles(node.children, term));
            }
        });
        return results;
    }

    const searchResults = search.trim() !== "" ? searchFiles(tree, search) : [];
    
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

        // Gestion UpdateRevision : afficher si changelog plus récent que la dernière vue
        const changelog = [
            { date: '2026-04-13' },
            { date: '2026-04-08' },
            { date: '2026-03-27' },
            { date: '2026-03-15' },
        ];
        const lastSeen = localStorage.getItem('ressources-last-seen');
        const latestChange = changelog[0].date;
        if (!lastSeen || lastSeen < latestChange) {
            setShowUpdate(true);
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
        fetchSamples().then(data => {
            setTree(data);
            // Sélection automatique via query param ?slug=...
            const params = new URLSearchParams(location.search);
            const slugParam = params.get('slug');
            if (slugParam) {
                const found = findNodeBySlug(data, slugParam);
                if (found) {
                    // Ouvre tous les dossiers parents ET le dossier cible (si c'est un dossier)
                    const folderSlugs = found.path
                        .filter(n => n.slug)
                        .map(n => n.slug);
                    setOpenFolders(folderSlugs);
                    // Si c'est un fichier (pas de children mais a un path), on le sélectionne
                    if (found.node.path && !found.node.children) {
                        setSelected(found.node);
                    } else {
                        setSelected(null); // On n'affiche rien dans le viewer si c'est un dossier
                    }
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

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
            {/* Affiche UpdateRevision en priorité, sinon ModalRevision */}
            <UpdateRevision isOpen={showUpdate} onClose={() => setShowUpdate(false)} />
            <ModalRevision isOpen={!showUpdate && showModal} onClose={() => setShowModal(false)} />
            <BlurForm open={formOpen && !formFilled} onClose={handleFormFilled} />
            <section className="Header">
                <NavBar background="bg-background" />
            </section>
            <div className="container">
                <section className="ressources mt-lg-5">
                    <h2 className="mb-4 mt-4" style={{ fontFamily: 'Aleo, serif', fontWeight: 700 }}>Ressources</h2>

                    <div className="row">
                        <div className="col-xs-12 col-lg-4">
                            {/* Barre de recherche */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Rechercher un fichier..."
                                    style={{ flex: 1, padding: '0.5rem 2.2rem 0.5rem 1rem', borderRadius: 20, border: '1px solid #ccc', fontSize: '1rem' }}
                                />
                                <span style={{ position: 'relative', left: '-2rem', color: '#888', pointerEvents: 'none' }}>
                                    <i className="fas fa-search" />
                                </span>
                            </div>
                            <div className="resource-tree">
                                {search.trim() !== "" ? (
                                    searchResults.length > 0 ? (
                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                            {searchResults.map((file, idx) => (
                                                <li key={idx} style={{ marginBottom: 8 }}>
                                                    <button
                                                        style={{ background: 'none', border: 'none', color: '#007bff', textAlign: 'left', cursor: 'pointer', padding: 0, fontSize: '1rem' }}
                                                        onClick={() => setSelected(file)}
                                                    >
                                                        <i className="fas fa-file-alt" style={{ marginRight: 8 }} />
                                                        {file.title || file.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div style={{ color: '#888', fontStyle: 'italic', padding: '1rem 0' }}>Aucun document ne correspond à votre recherche.</div>
                                    )
                                ) : (
                                    tree.map((node, i) => (
                                        <TreeNode
                                            key={i}
                                            node={node}
                                            onSelect={setSelected}
                                            level={0}
                                            openFolders={openFolders}
                                        />
                                    ))
                                )}
                            </div>
                            <NavLink to="/mcc" className="btn btn-black mb-5" style={{ fontWeight: 600, fontFamily: 'Rubik, sans-serif', fontSize: '.875rem', borderRadius: '2rem', padding: '0.75rem 1.5rem', textDecoration: 'none', boxShadow: '0px 5px 0px 0px rgba(0,0,0,0.1)', width: '100%' }}>
                                Simulateur de note
                            </NavLink>
                        </div>
                        <div className="col-xs-12 col-lg-8">
                            <div className="resource-viewer" ref={viewerRef}>
                                {selected ? (
                                    (() => {
                                        // Vérification PDF
                                        const isPdf = selected.path && selected.path.toLowerCase().endsWith('.pdf');
                                        // Vérification ZIP
                                        const isZip = selected.path && selected.path.toLowerCase().endsWith('.zip');
                                        // Vérification crédits
                                        const hasCredits = selected.credits && selected.credits.trim() !== '';
                                        // Vérification date
                                        const hasDate = selected.date && selected.date.trim() !== '';
                                        if (!isPdf && !isZip) {
                                            return (
                                                <div className="resource-error" style={{ textAlign: 'center', padding: '4rem 0' }}>
                                                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#d32f2f', marginBottom: 16 }} />
                                                    <p style={{ color: '#d32f2f', fontWeight: 600, fontSize: '1.2rem' }}>Ce fichier n'est pas un PDF ou le chemin est invalide.</p>
                                                    <p style={{ color: '#888', fontSize: '1rem', marginTop: 12 }}>
                                                        Il est possible que le fichier ne soit pas encore (ou plus) disponible.<br />
                                                        Besoin de cette ressource ? <a href="/contact" style={{ color: '#888', textDecoration: 'underline' }}>Me contacter</a>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div className="resource-meta">
                                                <div className="resource-meta-head mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <h3 style={{ fontFamily: 'Aleo, serif', fontWeight: 700, marginBottom: 0 }}>{selected.title}</h3>
                                                    <div className="d-flex align-items-center">

                                                        <button
                                                            onClick={() => {
                                                                // Créer un lien https://ewenrdo.fr/ressources?slug=... pour partager la ressource sélectionnée
                                                                const url = `${window.location.origin}/ressources?slug=${selected.slug}`;
                                                                navigator.clipboard.writeText(url).then(() => {
                                                                    alert('Lien copié dans le presse-papier !');
                                                                }).catch(() => {
                                                                    alert('Échec de la copie. Voici le lien : ' + url);
                                                                });
                                                            }}
                                                            className="btn-icon"
                                                        >
                                                            <i className="fas fa-share" style={{ marginRight: 6 }} />
                                                        </button>
                                                        <a
                                                            href={selected.path}
                                                            download
                                                            className="btn-icon"
                                                            style={{ color: 'black', textDecoration: 'none' }}
                                                        >
                                                            <i className="fas fa-download" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <p>{selected.comment}</p>
                                                {hasDate ? (
                                                    <p className="date">Modifié la dernière fois le <i>{selected.date}</i></p>
                                                ) : (
                                                    <p className="date" style={{ color: '#d32f2f' }}><i className="fas fa-exclamation-circle" style={{ marginRight: 6 }} />Date de modification manquante</p>
                                                )}
                                                {isZip ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', padding: '2rem', marginTop: 16, backgroundColor: '#f5f5f5', border: '1px solid #ddd', minHeight: '400px' }}>
                                                        <p style={{ color: '#666', fontSize: '1.1rem', fontStyle: 'italic', textAlign: 'center' }}>
                                                            <i className="fas fa-download" style={{ marginRight: 12, fontSize: '1.5rem', color: '#007bff' }} />
                                                            Cliquez sur le bouton télécharger pour récupérer le fichier ZIP.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <iframe
                                                        src={selected.path}
                                                        title={selected.title}
                                                        width="100%"
                                                        height="600px"
                                                        style={{ border: '1px solid #222', borderRadius: '0.5rem', marginTop: 16, background: '#fff' }}
                                                    />
                                                )}
                                                {hasCredits && (
                                                    <p className="date"><strong>Crédits :</strong> {selected.credits}</p>
                                                )}
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
