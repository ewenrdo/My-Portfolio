import React, { useEffect, } from 'react';

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
};

export default ResourceViewerModal;