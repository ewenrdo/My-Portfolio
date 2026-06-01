import React, { useEffect, useMemo, useState } from 'react';
import DockNav from '../assets/components/DockNav';
import '../assets/stylesheets/ressources.scss';

function ResourceViewerModal({ item, isOpen, onClose }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen || !item) return null;

    const isPdf = item.path?.toLowerCase().endsWith('.pdf');
    const isZip = item.path?.toLowerCase().endsWith('.zip');
    const isLink = item.type === 'link';
    const isHeavy = Boolean(item.heavy);
    const hasCredits = item.credits && item.credits.trim() !== '';
    const hasDate = item.date && item.date.trim() !== '';

    const handleShare = () => {
        const url = `${window.location.origin}/ressources?slug=${item.slug || ''}`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
                .then(() => alert('Lien de partage copié dans le presse-papiers !'))
                .catch(() => fallbackCopy(url));
        } else {
            fallbackCopy(url);
        }
    };

    const fallbackCopy = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; 
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            alert('Lien de partage copié dans le presse-papiers !');
        } catch (err) {
            alert('Impossible de copier le lien automatiquement. Le voici : ' + text);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="apple-modal-overlay" onClick={onClose}>
            <div className="apple-modal-container" onClick={(e) => e.stopPropagation()}>
                <header className="apple-modal-header">
                    <div className="header-left">
                        <span className="modal-kicker">Aperçu de la ressource</span>
                        <h2 className="modal-title">{item.title || item.name}</h2>
                    </div>
                    <div className="header-actions">
                        <button onClick={handleShare} className="action-btn" title="Partager le lien">
                            <i className="fas fa-share-alt" />
                        </button>
                        {isLink ? (
                            <a href={item.path} target="_blank" rel="noopener noreferrer" className="action-btn" title="Ouvrir le lien">
                                <i className="fas fa-external-link-alt" />
                            </a>
                        ) : (
                            <a href={item.path} download className="action-btn primary" title="Télécharger">
                                <i className="fas fa-download" />
                            </a>
                        )}
                        <button onClick={onClose} className="action-btn close" title="Fermer">
                            <i className="fas fa-times" />
                        </button>
                    </div>
                </header>

                <div className="apple-modal-body">
                    {item.comment && <p className="modal-comment">{item.comment}</p>}

                    <div className="modal-content-viewer">
                        {isHeavy ? (
                            <div className="viewer-placeholder">
                                <i className="fas fa-file-archive mb-3" />
                                <p>Ce fichier est lourd pour être affiché automatiquement sur le site.</p>
                                <a href={item.path} download className="apple-btn-primary">Télécharger le document</a>
                            </div>
                        ) : isZip ? (
                            <div className="viewer-placeholder">
                                <i className="fas fa-file-archive mb-3" />
                                <p>Cette archive ZIP est prête à être téléchargée.</p>
                                <a href={item.path} download className="apple-btn-primary">Télécharger l'archive ZIP</a>
                            </div>
                        ) : isLink ? (
                            <div className="viewer-placeholder">
                                <i className="fas fa-link mb-3" />
                                <p>Cette ressource est un lien externe.</p>
                                <a href={item.path} target="_blank" rel="noopener noreferrer" className="apple-btn-primary">Ouvrir le lien</a>
                            </div>
                        ) : isPdf ? (
                            <iframe src={item.path} title={item.title || item.name} className="pdf-iframe" />
                        ) : (
                            <div className="viewer-error">
                                <i className="fas fa-exclamation-triangle" />
                                <p>Aucun aperçu direct disponible pour ce type de fichier.</p>
                                <a href={item.path} download className="apple-btn-primary">Télécharger le fichier</a>
                            </div>
                        )}
                    </div>

                    <footer className="modal-footer">
                        {hasDate ? (
                            <span className="footer-info">Dernière modification le : <strong>{item.date}</strong></span>
                        ) : (
                            <span className="footer-info error"><i className="fas fa-exclamation-circle" /> Date de modification manquante</span>
                        )}
                        {hasCredits && (
                            <span className="footer-info credits"><strong>Crédits :</strong> {item.credits}</span>
                        )}
                    </footer>
                </div>
            </div>
        </div>
    );
}

const EMPTY_TREE = [];

function isFolderNode(node) {
    return Boolean(node && Array.isArray(node.children));
}

function isFileNode(node) {
    return Boolean(node && node.path && !Array.isArray(node.children));
}

export default function RessourcesClone() {
    const [rootTree, setRootTree] = useState([]);
    const [pathStack, setPathStack] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [dataSource, setDataSource] = useState('mock');
    const [navDirection, setNavDirection] = useState('forward');
    const [transitionKey, setTransitionKey] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const url = '/ressources.json?v=' + Date.now();

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Impossible de charger les ressources.');
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setRootTree(data);
                    setDataSource('json');
                    return;
                }
                setRootTree(EMPTY_TREE);
                setDataSource('mock');
            })
            .catch(() => {
                setRootTree(EMPTY_TREE);
                setDataSource('mock');
                setLoadError('Le fichier ressources.json est indisponible. Affichage du mode démo.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const currentFolderChildren = useMemo(() => {
        if (pathStack.length === 0) {
            return rootTree;
        }
        const currentFolder = pathStack[pathStack.length - 1];
        return Array.isArray(currentFolder.children) ? currentFolder.children : [];
    }, [pathStack, rootTree]);

    const breadcrumbs = useMemo(() => {
        return [{ label: 'Racine' }, ...pathStack.map((folder) => ({ label: folder.name || folder.title || 'Dossier' }))];
    }, [pathStack]);

    function openFolder(folder) {
        setNavDirection('forward');
        setTransitionKey((value) => value + 1);
        setPathStack((prev) => [...prev, folder]);
    }

    function goBackOneLevel() {
        setNavDirection('back');
        setTransitionKey((value) => value + 1);
        setPathStack((prev) => prev.slice(0, -1));
    }

    function goToLevel(levelIndex) {
        setNavDirection(levelIndex < pathStack.length - 1 ? 'back' : 'forward');

        if (levelIndex < 0) {
            setTransitionKey((value) => value + 1);
            setPathStack([]);
            return;
        }

        setTransitionKey((value) => value + 1);
        setPathStack((prev) => prev.slice(0, levelIndex + 1));
    }

    return (
        <>
            <div className="ressources-clone-page">
                <main className="ressources-clone-shell">
                    <section className="clone-shell-copy">
                        <span className="clone-kicker">Explorateur de ressources</span>
                        <h1>Arborescence fluide, sobre et lisible</h1>
                        <p>
                            Ouvrez un dossier, remontez d&apos;un niveau avec le chevron discret, ou revenez directement via le chemin.
                        </p>
                    </section>

                    <section className="apple-explorer" aria-label="Explorateur de fichiers">
                        <header className="apple-explorer-head">
                            <button
                                type="button"
                                className="apple-back"
                                aria-label="Remonter d'un dossier"
                                onClick={goBackOneLevel}
                                disabled={pathStack.length === 0}
                            >
                                <i className="fas fa-chevron-left" />
                            </button>

                            <nav className="apple-breadcrumbs" aria-label="Fil d'ariane">
                                {breadcrumbs.map((item, index) => (
                                    <React.Fragment key={`${item.label}-${index}`}>
                                        {index > 0 ? <span className="apple-crumb-separator">/</span> : null}
                                        <button
                                            type="button"
                                            className={`apple-crumb ${index === breadcrumbs.length - 1 ? 'is-current' : ''}`}
                                            onClick={() => goToLevel(index - 1)}
                                            disabled={index === breadcrumbs.length - 1}
                                        >
                                            {item.label}
                                        </button>
                                    </React.Fragment>
                                ))}
                            </nav>
                        </header>

                        <div key={transitionKey} className={`apple-list-wrap ${navDirection === 'forward' ? 'is-forward' : 'is-back'}`}>
                            {isLoading ? <p className="apple-feedback">Chargement...</p> : null}
                            {loadError ? <p className="apple-feedback apple-feedback-error">{loadError}</p> : null}
                            {dataSource === 'mock' ? <p className="apple-feedback apple-feedback-subtle">Mode démo : données mockées.</p> : null}

                            {!isLoading && currentFolderChildren.length === 0 && pathStack.length > 0 ? (
                                <p className="apple-feedback">Ce dossier est vide.</p>
                            ) : null}

                            {!isLoading ? (
                                <ul className="apple-list">
                                    {/* Ligne pour le simulateur de notes (hors ressources.json, racine seulement) */}
                                    {pathStack.length === 0 && (
                                        <li>
                                            <a href="/mcc" className="apple-row" style={{ textDecoration: 'none' }}>
                                                <span className="apple-row-leading is-proba" aria-hidden="true" style={{ background: 'linear-gradient(135deg, #ff9500, #ff5e00)', color: '#fff' }}>
                                                    <i className="fas fa-calculator" />
                                                </span>
                                                <span className="apple-row-copy">
                                                    <span className="apple-row-title" style={{ fontWeight: '600' }}>Simulateur de notes (MCC)</span>
                                                    <span className="apple-row-meta">Outil interactif</span>
                                                </span>
                                            </a>
                                        </li>
                                    )}

                                    {currentFolderChildren.map((item, index) => {
                                        const folder = isFolderNode(item);
                                        const file = isFileNode(item);
                                        const itemPath = String(item.path || '').toLowerCase();
                                        const isPdf = file && itemPath.endsWith('.pdf');
                                        const isZip = file && itemPath.endsWith('.zip');
                                        const isLink = item.type === 'link';
                                        const itemLabel = item.title || item.name || `Élément ${index + 1}`;
                                        const itemMeta = folder
                                            ? `${Array.isArray(item.children) ? item.children.length : 0} élément(s)`
                                            : isLink
                                                ? 'Lien'
                                                : isPdf
                                                    ? 'PDF'
                                                    : isZip
                                                        ? 'ZIP'
                                                        : 'Fichier quelconque';

                                        return (
                                            <li key={`${itemLabel}-${index}`}>
                                                <button
                                                    type="button"
                                                    className="apple-row"
                                                    onClick={() => {
                                                        if (folder) {
                                                            openFolder(item);
                                                        } else {
                                                            setSelectedItem(item);
                                                        }
                                                    }}
                                                    onDoubleClick={() => {
                                                        if (folder) {
                                                            openFolder(item);
                                                        }
                                                    }}
                                                >
                                                    <span
                                                        className={`apple-row-leading ${folder ? 'is-folder' : isPdf ? 'is-pdf' : isZip ? 'is-zip' : isLink ? 'is-link' : 'is-file'}`}
                                                        aria-hidden="true"
                                                    >
                                                        <i className={`fas ${folder ? 'fa-folder' : isPdf ? 'fa-file-pdf' : isZip ? 'fa-file-archive' : isLink ? 'fa-link' : 'fa-file-alt'}`} />
                                                    </span>

                                                    <span className="apple-row-copy">
                                                        <span className="apple-row-title">{itemLabel}</span>
                                                        <span className="apple-row-meta">{itemMeta}</span>
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : null}
                        </div>
                    </section>
                </main>

                <DockNav />
                <div className="clone-glow clone-glow-a" aria-hidden="true" />
                <div className="clone-glow clone-glow-b" aria-hidden="true" />
            </div>

            <ResourceViewerModal 
                item={selectedItem} 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />
        </>
    );
}