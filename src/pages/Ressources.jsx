import React, { useEffect, useMemo, useState } from 'react';
import '../assets/stylesheets/ressources.scss';
import DockNav from '../assets/components/DockNav';
import ResourceViewerModal from '../assets/components/ResourceViewerModal';
import WarningModal from '../assets/components/WarningModal';

const EMPTY_TREE = [];

function isFolderNode(node) {
    return Boolean(node && Array.isArray(node.children));
}

function isFileNode(node) {
    return Boolean(node && node.path && !Array.isArray(node.children));
}

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

function searchFiles(nodes, term) {
    let results = [];
    nodes.forEach(node => {
        const isFile = isFileNode(node);
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

export default function RessourcesClone() {
    const [rootTree, setRootTree] = useState([]);
    const [pathStack, setPathStack] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [dataSource, setDataSource] = useState('mock');
    const [navDirection, setNavDirection] = useState('forward');
    const [transitionKey, setTransitionKey] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
    const [warningItem, setWarningItem] = useState(null);
    
    // États pour la recherche et la pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- NOUVEAUX ÉTATS POUR LE FORMULAIRE DE PROPOSITION ---
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestionForm, setSuggestionForm] = useState({
        firstname: '',
        lastname: '',
        contact: '',
        resourceLink: '',
        consent: false
    });
    const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: false });
    const contributeUrl = 'https://github.com/ewenrdo/dl-mathinfo-vault#contribuer';

    useEffect(() => {
        const url = '/resources/ressources.json?v=' + Date.now();

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
                setLoadError('Le fichier ressources.json est indisponible, seuls les liens mockés seront affichés.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [pathStack, searchQuery]);

    useEffect(() => {
        if (rootTree && rootTree.length > 0) {
            const params = new URLSearchParams(window.location.search);
            const slugParam = params.get('slug');
            if (slugParam) {
                const found = findNodeBySlug(rootTree, slugParam);
                if (found) {
                    const parentFolders = found.path.filter(node => isFolderNode(node) && node.slug !== slugParam);
                    setPathStack(parentFolders);
                    
                    if (isFileNode(found.node)) {
                        setSelectedItem(found.node);
                    } else if (isFolderNode(found.node)) {
                        setPathStack(found.path);
                    }
                }
            }
        }
    }, [rootTree]);

    const currentFolderChildren = useMemo(() => {
        if (pathStack.length === 0) {
            return rootTree;
        }
        const currentFolder = pathStack[pathStack.length - 1];
        return Array.isArray(currentFolder.children) ? currentFolder.children : [];
    }, [pathStack, rootTree]);

    const unifiedRootChildren = useMemo(() => {
        if (pathStack.length > 0) return currentFolderChildren;
        
        const simulatorItem = {
            isSimulator: true,
            title: "Simulateur de notes (MCC)",
            name: "mcc",
            type: "link"
        };
        const vacationCountdownItem = {
            isVacationCountdown: true,
            title: "Décompte avant les vacances",
            name: "holidays",
            type: "link"
        };
        return [...currentFolderChildren, simulatorItem, vacationCountdownItem];
    }, [currentFolderChildren, pathStack]);

    const breadcrumbs = useMemo(() => {
        return [{ label: 'Racine' }, ...pathStack.map((folder) => ({ label: folder.name || folder.title || 'Dossier' }))];
    }, [pathStack]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return searchFiles(rootTree, searchQuery);
    }, [rootTree, searchQuery]);

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        if (searchQuery.trim() !== '') {
            return searchResults.slice(start, start + itemsPerPage);
        }
        return unifiedRootChildren.slice(start, start + itemsPerPage);
    }, [unifiedRootChildren, searchResults, searchQuery, currentPage]);

    const totalPages = useMemo(() => {
        const totalItems = searchQuery.trim() !== '' ? searchResults.length : unifiedRootChildren.length;
        return Math.ceil(totalItems / itemsPerPage);
    }, [unifiedRootChildren, searchResults, searchQuery]);

    function openFolder(folder) {
        setNavDirection('forward');
        setTransitionKey((value) => value + 1);
        setPathStack((prev) => [...prev, folder]);
    }

    function getItemWarning(item) {
        return typeof item?.warning === 'string' ? item.warning.trim() : '';
    }

    function openItem(item) {
        if (isFolderNode(item)) {
            openFolder(item);
            return;
        }

        setSelectedItem(item);
    }

    function handleItemClick(item) {
        if (getItemWarning(item)) {
            setWarningItem(item);
            return;
        }

        openItem(item);
    }

    function confirmWarningItem() {
        if (!warningItem) return;

        const itemToOpen = warningItem;
        setWarningItem(null);
        openItem(itemToOpen);
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

    // --- SOUMISSION DU FORMULAIRE VIA API VERCEL ---
    const handleSuggestionSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ loading: true, error: '', success: false });

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'suggestion',
                    ...suggestionForm
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Une erreur est survenue.');
            }

            setFormStatus({ loading: false, error: '', success: true });
            setSuggestionForm({ firstname: '', lastname: '', contact: '', resourceLink: '', consent: false });
            
            setTimeout(() => {
                setIsSuggesting(false);
                setFormStatus(prev => ({ ...prev, success: false }));
            }, 2500);

        } catch (err) {
            setFormStatus({ loading: false, error: err.message, success: false });
        }
    };

    return (
        <>
            <div className="ressources-clone-page">
                <main className="ressources-clone-shell">
                    <section className="clone-shell-copy">
                        <span className="clone-kicker">Bibliothèque numérique</span>
                        <h1>Ressources et archives</h1>
                        <p>
                            Retrouvez mes notes de cours et toutes les ressources que j'utilise pour mes études et recherches personnelles.
                        </p>
                    </section>

                    <section className="apple-explorer" aria-label="Explorateur de fichiers">
                        
                        {/* --- BARRE DE RECHERCHE APPLE-LIKE AVEC BOUTON AJOUT --- */}
                        <div className="apple-search-layout">
                            <div className="apple-search-wrapper">
                                <i className="fas fa-search apple-search-icon" />
                                <input
                                    type="text"
                                    className="apple-search-input"
                                    placeholder="Rechercher un document..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    disabled={isSuggesting}
                                />
                                {searchQuery && (
                                    <button 
                                        className="apple-search-clear" 
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Effacer la recherche"
                                    >
                                        <i className="fas fa-times-circle" />
                                    </button>
                                )}
                            </div>
                            
                            <button 
                                type="button"
                                className={`apple-suggest-trigger ${isSuggesting ? 'is-active' : ''}`}
                                onClick={() => {
                                    window.location.assign(contributeUrl);
                                }}
                                aria-label="Contribuer sur GitHub"
                                title="Contribuer sur GitHub"
                            >
                                <i className={`fas ${isSuggesting ? 'fa-times' : 'fa-plus'}`} />
                                <span className="btn-text">Contribuer</span>
                            </button>
                        </div>

                        {/* --- COMPOSANT FORMULAIRE DE PROPOSITION --- */}
                        {isSuggesting ? (
                            <div className="apple-form-container">
                                <h2 className="form-title">Proposer un document</h2>
                                <p className="form-subtitle">Partagez une ressource utile. Elle sera vérifiée avant publication.<br/>
                                Vous pouvez utiliser GitHub ou Google Drive (avec un lien public !) pour héberger votre document et obtenir un lien.</p>
                                
                                <form onSubmit={handleSuggestionSubmit} className="apple-form">
                                    <div className="form-row-grid">
                                        <div className="form-group">
                                            <label htmlFor="firstname">Prénom</label>
                                            <input 
                                                type="text" id="firstname" required placeholder="Jean"
                                                value={suggestionForm.firstname}
                                                onChange={e => setSuggestionForm({...suggestionForm, firstname: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastname">Nom</label>
                                            <input 
                                                type="text" id="lastname" required placeholder="Dupont"
                                                value={suggestionForm.lastname}
                                                onChange={e => setSuggestionForm({...suggestionForm, lastname: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="contact">Moyen de contact</label>
                                        <input 
                                            type="text" id="contact" required placeholder="Email, Discord ou Instagram"
                                            value={suggestionForm.contact}
                                            onChange={e => setSuggestionForm({...suggestionForm, contact: e.target.value})}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="resourceLink">Lien public vers la ressource</label>
                                        <input 
                                            type="url" id="resourceLink" required placeholder="https://drive.google.com/..."
                                            value={suggestionForm.resourceLink}
                                            onChange={e => setSuggestionForm({...suggestionForm, resourceLink: e.target.value})}
                                        />
                                    </div>

                                    <div className="form-group-checkbox">
                                        <label className="apple-checkbox-label">
                                            <input 
                                                type="checkbox" required
                                                checked={suggestionForm.consent}
                                                onChange={e => setSuggestionForm({...suggestionForm, consent: e.target.checked})}
                                            />
                                            <span className="checkbox-text">
                                                J'accepte la publication de ce document sur le site s'il est validé.
                                            </span>
                                        </label>
                                    </div>

                                    <button type="submit" className="apple-btn-primary form-submit" disabled={formStatus.loading}>
                                        {formStatus.loading ? 'Envoi...' : 'Envoyer la proposition'}
                                    </button>

                                    {formStatus.error && <p className="form-message error">{formStatus.error}</p>}
                                    {formStatus.success && <p className="form-message success">Merci ! Votre proposition a été envoyée par e-mail.</p>}
                                </form>
                            </div>
                        ) : (
                            <div key={transitionKey} className={`apple-list-wrap ${navDirection === 'forward' ? 'is-forward' : 'is-back'}`}>
                                {isLoading ? <p className="apple-feedback">Chargement...</p> : null}
                                {loadError ? <p className="apple-feedback apple-feedback-error">{loadError}</p> : null}
                                {dataSource === 'mock' && searchQuery.trim() === '' ? (
                                    <p className="apple-feedback apple-feedback-subtle">Mode secure : liens mockés seulement.</p>
                                ) : null}

                                {/* NAVIGATION CHEVRON ET ARIANE */}
                                {searchQuery.trim() === '' && (
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
                                )}

                                {/* RENDU RECHERCHE ACTIVE */}
                                {searchQuery.trim() !== '' ? (
                                    <>
                                        <div className="apple-search-results-header">
                                            Résultats de recherche ({searchResults.length})
                                        </div>
                                        {searchResults.length === 0 ? (
                                            <p className="apple-feedback">Aucun document ne correspond à votre recherche.</p>
                                        ) : (
                                            <ul className="apple-list">
                                                {paginatedItems.map((item, index) => {
                                                    const itemPath = String(item.path || '').toLowerCase();
                                                    const isPdf = itemPath.endsWith('.pdf');
                                                    const isZip = itemPath.endsWith('.zip');
                                                    const isLink = item.type === 'link';
                                                    const itemLabel = item.title || item.name || `Élément ${index + 1}`;
                                                    const itemMeta = isLink ? 'Lien' : isPdf ? 'PDF' : isZip ? 'ZIP' : 'Fichier';

                                                    return (
                                                        <li key={`${itemLabel}-${index}`}>
                                                            <button
                                                                type="button"
                                                                className="apple-row"
                                                                onClick={() => handleItemClick(item)}
                                                            >
                                                                <span
                                                                    className={`apple-row-leading ${isPdf ? 'is-pdf' : isZip ? 'is-zip' : isLink ? 'is-link' : 'is-file'}`}
                                                                    aria-hidden="true"
                                                                >
                                                                    <i className={`fas ${isPdf ? 'fa-file-pdf' : isZip ? 'fa-file-archive' : isLink ? 'fa-link' : 'fa-file-alt'}`} />
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
                                        )}
                                    </>
                                ) : (
                                    /* RENDU ARBORESCENCE STANDARD */
                                    <>
                                        {!isLoading && unifiedRootChildren.length === 0 ? (
                                            <p className="apple-feedback">Ce dossier est vide.</p>
                                        ) : null}

                                        {!isLoading ? (
                                            <ul className="apple-list">
                                                {paginatedItems.map((item, index) => {
                                                    if (item.isSimulator) {
                                                        return (
                                                            <li key="mcc-simulator-link">
                                                                <a href="/mcc" className="apple-row" style={{ textDecoration: 'none' }}>
                                                                    <span className="apple-row-leading" aria-hidden="true" style={{ background: 'linear-gradient(135deg, #ff9500, #ff5e00)', color: '#fff' }}>
                                                                        <i className="fas fa-calculator" />
                                                                    </span>
                                                                    <span className="apple-row-copy">
                                                                        <span className="apple-row-title" style={{ fontWeight: '600' }}>Simulateur de notes (MCC)</span>
                                                                        <span className="apple-row-meta">Outil interactif</span>
                                                                    </span>
                                                                </a>
                                                            </li >
                                                        );
                                                    }

                                                    if (item.isVacationCountdown) {
                                                        return (
                                                            <li key="holidays-countdown-link">
                                                                <a href="/holidays" className="apple-row" style={{ textDecoration: 'none' }}>
                                                                    <span className="apple-row-leading" aria-hidden="true" style={{ background: 'linear-gradient(135deg, #34c759, #1f9d4a)', color: '#fff' }}>
                                                                        <i className="fas fa-umbrella-beach" />
                                                                    </span>
                                                                    <span className="apple-row-copy">
                                                                        <span className="apple-row-title" style={{ fontWeight: '600' }}>Décompte avant les vacances</span>
                                                                        <span className="apple-row-meta">Compte à rebours</span>
                                                                    </span>
                                                                </a>
                                                            </li>
                                                        );
                                                    }

                                                    const folder = isFolderNode(item);
                                                    const file = isFileNode(item);
                                                    const itemPath = String(item.path || '').toLowerCase();
                                                    const isPdf = file && itemPath.endsWith('.pdf');
                                                    const isZip = file && itemPath.endsWith('.zip');
                                                    const isMd = file && itemPath.endsWith('.md');
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
                                                                    : isMd
                                                                        ? 'Note'
                                                                    : 'Fichier quelconque';

                                                    return (
                                                        <li key={`${itemLabel}-${index}`}>
                                                            <button
                                                                type="button"
                                                                className="apple-row"
                                                                onClick={() => handleItemClick(item)}
                                                                onDoubleClick={() => handleItemClick(item)}
                                                            >
                                                                <span
                                                                    className={`apple-row-leading ${folder ? 'is-folder' : isPdf ? 'is-pdf' : isZip ? 'is-zip' : isLink ? 'is-link' : isMd ? 'is-md' : 'is-file'}`}
                                                                    aria-hidden="true"
                                                                >
                                                                    <i className={`fas ${folder ? 'fa-folder' : isPdf ? 'fa-file-pdf' : isZip ? 'fa-file-archive' : isLink ? 'fa-link' : isMd ? 'fa-file-alt' : 'fa-file-alt'}`} />
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
                                    </>
                                )}

                                {/* --- COMPOSANT DE PAGINATION --- */}
                                {totalPages > 1 && (
                                    <nav className="apple-pagination" aria-label="Pagination">
                                        <button 
                                            type="button"
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            aria-label="Page précédente"
                                        >
                                            <i className="fas fa-chevron-left" />
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                className={`pagination-btn ${currentPage === page ? 'is-active' : ''}`}
                                                onClick={() => setCurrentPage(page)}
                                                disabled={currentPage === page}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        <button 
                                            type="button"
                                            className="pagination-btn"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            aria-label="Page suivante"
                                        >
                                            <i className="fas fa-chevron-right" />
                                        </button>
                                    </nav>
                                )}
                            </div>
                        )}
                    </section>
                </main>

                <DockNav />
                <div className="clone-glow clone-glow-a" aria-hidden="true" />
                <div className="clone-glow clone-glow-b" aria-hidden="true" />
            </div>

            <WarningModal
                item={warningItem}
                isOpen={!!warningItem}
                onClose={() => setWarningItem(null)}
                onConfirm={confirmWarningItem}
            />

            <ResourceViewerModal 
                item={selectedItem} 
                isOpen={!!selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />
        </>
    );
}