import React, { useEffect, useMemo, useState } from 'react';
import DockNav from '../assets/components/DockNav';
import '../assets/stylesheets/ressources-clone.scss';

const MOCK_TREE = [
    {
        name: 'Documents',
        children: [
            {
                name: 'Cours',
                children: [
                    {
                        name: 'Analyse',
                        children: [
                            {
                                name: 'chapitre-1.pdf',
                                path: '/resources/livret-exam-l2-2026/livret-exam-l2-2026.pdf',
                                title: 'Chapitre 1 - Suites et limites'
                            },
                            {
                                name: 'chapitre-2.pdf',
                                path: '/resources/livret-paques-2026/livret-paques-2026.pdf',
                                title: 'Chapitre 2 - Series numeriques'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Exercices',
                children: [
                    {
                        name: 'TD-ASF4.zip',
                        path: '/resources/td-asf4/td2-formes-lineaires.pdf',
                        title: 'TD ASF4'
                    }
                ]
            }
        ]
    },
    {
        name: 'Liens',
        children: [
            {
                name: 'Math Lesson Maker',
                path: 'https://ewenrdo.github.io/Math-Lesson-Maker/',
                type: 'link'
            }
        ]
    }
];

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

                setRootTree(MOCK_TREE);
                setDataSource('mock');
            })
            .catch(() => {
                setRootTree(MOCK_TREE);
                setDataSource('mock');
                setLoadError('Le fichier ressources.json est indisponible. Affichage du mode demo.');
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
                            {dataSource === 'mock' ? <p className="apple-feedback apple-feedback-subtle">Mode demo: donnees mock 3 niveaux.</p> : null}

                            {!isLoading && currentFolderChildren.length === 0 ? <p className="apple-feedback">Ce dossier est vide.</p> : null}

                            {!isLoading ? (
                                <ul className="apple-list">
                                    {currentFolderChildren.map((item, index) => {
                                        const folder = isFolderNode(item);
                                        const file = isFileNode(item);
                                        const itemPath = String(item.path || '').toLowerCase();
                                        const isPdf = file && itemPath.endsWith('.pdf');
                                        const isZip = file && itemPath.endsWith('.zip');
                                        const isLink = item.type === 'link';
                                        const itemLabel = item.title || item.name || `Element ${index + 1}`;
                                        const itemMeta = folder
                                            ? `${Array.isArray(item.children) ? item.children.length : 0} element(s)`
                                            : isLink
                                                ? 'Lien'
                                                : isPdf
                                                    ? 'PDF'
                                                    : isZip
                                                        ? 'Zip'
                                                        : 'Fichier quelconque';

                                        return (
                                            <li key={`${itemLabel}-${index}`}>
                                                <button
                                                    type="button"
                                                    className="apple-row"
                                                    onClick={() => {
                                                        if (folder) {
                                                            openFolder(item);
                                                            return;
                                                        }

                                                        if (file && item.path) {
                                                            window.open(String(item.path), '_blank', 'noopener,noreferrer');
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
        </>
    );
}