import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ADMONITION_REGEX =
    /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i;

function remarkAdmonitions() {
    return (tree) => {
        const visit = (node) => {
            if (!node || !Array.isArray(node.children)) return;

            if (node.type === 'blockquote') {
                const firstParagraph = node.children.find(
                    child => child.type === 'paragraph'
                );

                if (firstParagraph && Array.isArray(firstParagraph.children)) {
                    const firstTextIndex = firstParagraph.children.findIndex(
                        child => child.type === 'text'
                    );

                    if (firstTextIndex !== -1) {
                        const firstText = firstParagraph.children[firstTextIndex];
                        const match = firstText.value.match(ADMONITION_REGEX);

                        if (match) {
                            const type = match[1].toUpperCase();
                            const cleanedValue = firstText.value.replace(
                                ADMONITION_REGEX,
                                ''
                            );

                            if (cleanedValue.trim() === '') {
                                firstParagraph.children.splice(firstTextIndex, 1);

                                if (firstParagraph.children.length === 0) {
                                    const paragraphIndex = node.children.indexOf(firstParagraph);

                                    if (paragraphIndex !== -1) {
                                        node.children.splice(paragraphIndex, 1);
                                    }
                                }
                            } else {
                                firstText.value = cleanedValue;
                            }

                            node.data = {
                                ...(node.data || {}),
                                hProperties: {
                                    ...(node.data?.hProperties || {}),
                                    'data-admonition': type
                                }
                            };
                        }
                    }
                }
            }

            node.children.forEach(visit);
        };

        visit(tree);
    };
}

const ADMONITION_CONFIG = {
    NOTE: {
        icon: 'fa-info-circle',
        label: 'Note',
        className: 'md-admonition-note'
    },
    TIP: {
        icon: 'fa-lightbulb',
        label: 'Astuce',
        className: 'md-admonition-tip'
    },
    IMPORTANT: {
        icon: 'fa-exclamation-circle',
        label: 'Important',
        className: 'md-admonition-important'
    },
    WARNING: {
        icon: 'fa-exclamation-triangle',
        label: 'Attention',
        className: 'md-admonition-warning'
    },
    CAUTION: {
        icon: 'fa-skull-crossbones',
        label: 'Danger',
        className: 'md-admonition-caution'
    }
};

function MarkdownBlockquote({ node, children, ...props }) {
    const type = node?.properties?.['data-admonition']?.toUpperCase();

    if (!type || !ADMONITION_CONFIG[type]) {
        return (
            <blockquote {...props}>
                {children}
            </blockquote>
        );
    }

    const config = ADMONITION_CONFIG[type];

    return (
        <aside className={`md-admonition ${config.className}`}>
            <div className="md-admonition-header">
                <i
                    className={`fas ${config.icon}`}
                    aria-hidden="true"
                />
                <span>{config.label}</span>
            </div>

            <div className="md-admonition-content">
                {children}
            </div>
        </aside>
    );
}

function ResourceViewerModal({ item, isOpen, onClose }) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [feedbackForm, setFeedbackForm] = useState({
        firstname: '',
        lastname: '',
        comment: ''
    });
    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: false
    });
    const [markdownContent, setMarkdownContent] = useState(
        '_Chargement du contenu Markdown..._'
    );

    useEffect(() => {
        setIsFormOpen(false);
        setFeedbackForm({
            firstname: '',
            lastname: '',
            comment: ''
        });
        setStatus({
            loading: false,
            error: '',
            success: false
        });
        setMarkdownContent('_Chargement du contenu Markdown..._');

        if (item?.path?.toLowerCase().endsWith('.md')) {
            fetch(item.path)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(
                            'Impossible de charger le fichier Markdown.'
                        );
                    }

                    return response.text();
                })
                .then(text => {
                    setMarkdownContent(text);
                })
                .catch(() => {
                    setMarkdownContent(
                        '_Impossible de charger le contenu Markdown._'
                    );
                });
        }
    }, [item, isOpen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen || !item) {
        return null;
    }

    const isPdf = item.path?.toLowerCase().endsWith('.pdf');
    const isZip = item.path?.toLowerCase().endsWith('.zip');
    const isLink = item.type === 'link';
    const isMd = item.path?.toLowerCase().endsWith('.md');
    const isHeavy = Boolean(item.heavy);
    const hasCredits = item.credits && item.credits.trim() !== '';
    const hasDate = item.date && item.date.trim() !== '';

    const fallbackCopy = (text) => {
        const textArea = document.createElement('textarea');

        textArea.value = text;
        textArea.style.position = 'fixed';

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            alert('Lien de partage copié dans le presse-papiers !');
        } catch (err) {
            alert(
                'Impossible de copier le lien automatiquement. Le voici : ' +
                text
            );
        }

        document.body.removeChild(textArea);
    };

    const handleShare = () => {
        const url = `${window.location.origin}/ressources?slug=${item.slug || ''}`;

        if (navigator.clipboard?.writeText) {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    alert('Lien de partage copié dans le presse-papiers !');
                })
                .catch(() => {
                    fallbackCopy(url);
                });
        } else {
            fallbackCopy(url);
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();

        if (
            !feedbackForm.comment.trim() ||
            !feedbackForm.firstname.trim() ||
            !feedbackForm.lastname.trim()
        ) {
            return;
        }

        setStatus({
            loading: true,
            error: '',
            success: false
        });

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'feedback',
                    resourceSlug: item.slug || 'aucun-slug',
                    resourceTitle: item.title || item.name,
                    firstname: feedbackForm.firstname,
                    lastname: feedbackForm.lastname,
                    comment: feedbackForm.comment
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || 'Une erreur est survenue.'
                );
            }

            setStatus({
                loading: false,
                error: '',
                success: true
            });

            setFeedbackForm({
                firstname: '',
                lastname: '',
                comment: ''
            });

            setTimeout(() => {
                setStatus(prev => ({
                    ...prev,
                    success: false
                }));

                setIsFormOpen(false);
            }, 3000);
        } catch (err) {
            setStatus({
                loading: false,
                error: err.message,
                success: false
            });
        }
    };

    return (
        <div
            className="apple-modal-overlay"
            onClick={onClose}
        >
            <div
                className="apple-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="apple-modal-header">
                    <div className="header-left">
                        <span className="modal-kicker">
                            Aperçu de la ressource
                        </span>

                        <h2 className="modal-title">
                            {item.title || item.name}
                        </h2>
                    </div>

                    <div className="header-actions">
                        <button
                            onClick={handleShare}
                            className="action-btn"
                            title="Partager le lien"
                        >
                            <i className="fas fa-share-alt" />
                        </button>

                        {isLink ? (
                            <a
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn"
                                title="Ouvrir le lien"
                            >
                                <i className="fas fa-external-link-alt" />
                            </a>
                        ) : (
                            <a
                                href={item.path}
                                download
                                className="action-btn primary"
                                title="Télécharger"
                            >
                                <i className="fas fa-download" />
                            </a>
                        )}

                        <button
                            onClick={onClose}
                            className="action-btn close"
                            title="Fermer"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                </header>

                <div className="apple-modal-body">
                    {item.comment && (
                        <p className="modal-comment">
                            {item.comment}
                        </p>
                    )}

                    <div className="modal-content-viewer">
                        {isHeavy ? (
                            <div className="viewer-placeholder">
                                <i className="fas fa-file-archive mb-3" />

                                <p>
                                    Ce fichier est trop lourd pour être affiché automatiquement sur le site.
                                </p>

                                <a
                                    href={item.path}
                                    download
                                    className="apple-btn-primary"
                                >
                                    Télécharger le document
                                </a>
                            </div>
                        ) : isZip ? (
                            <div className="viewer-placeholder">
                                <i className="fas fa-file-archive mb-3" />

                                <p>
                                    Cette archive ZIP est prête à être téléchargée.
                                </p>

                                <a
                                    href={item.path}
                                    download
                                    className="apple-btn-primary"
                                >
                                    Télécharger l'archive ZIP
                                </a>
                            </div>
                        ) : isLink ? (
                            <div className="viewer-placeholder">
                                <i className="fas fa-link mb-3" />

                                <p>
                                    Cette ressource est un lien externe.
                                </p>

                                <a
                                    href={item.path}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="apple-btn-primary"
                                >
                                    Ouvrir le lien
                                </a>
                            </div>
                        ) : isPdf ? (
                            <iframe
                                src={item.path}
                                title={item.title || item.name}
                                className="pdf-iframe"
                            />
                        ) : isMd ? (
                            <div className="md-viewer">
                                <Markdown
                                    remarkPlugins={[
                                        remarkGfm,
                                        remarkAdmonitions
                                    ]}
                                    components={{
                                        blockquote: MarkdownBlockquote
                                    }}
                                >
                                    {markdownContent}
                                </Markdown>
                            </div>
                        ) : (
                            <div className="viewer-error">
                                <i className="fas fa-exclamation-triangle" />

                                <p>
                                    Aucun aperçu direct disponible pour ce type de fichier.
                                </p>

                                <a
                                    href={item.path}
                                    download
                                    className="apple-btn-primary"
                                >
                                    Télécharger le fichier
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="apple-modal-feedback-section">
                        {!isFormOpen ? (
                            <button
                                type="button"
                                className="feedback-toggle-btn"
                                onClick={() => setIsFormOpen(true)}
                            >
                                <i className="fas fa-comment-alt" />
                                Faire un retour ou signaler une erreur
                            </button>
                        ) : (
                            <div className="feedback-drawer">
                                <div className="feedback-drawer-header">
                                    <h3 className="feedback-title">
                                        Faire un retour sur ce document
                                    </h3>

                                    <button
                                        type="button"
                                        className="feedback-close-btn"
                                        onClick={() => setIsFormOpen(false)}
                                        disabled={status.loading}
                                    >
                                        Annuler
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleFeedbackSubmit}
                                    className="feedback-form"
                                >
                                    <div className="feedback-identity-grid">
                                        <div className="feedback-field">
                                            <input
                                                type="text"
                                                placeholder="Prénom"
                                                required
                                                value={feedbackForm.firstname}
                                                disabled={status.loading}
                                                onChange={(e) =>
                                                    setFeedbackForm({
                                                        ...feedbackForm,
                                                        firstname: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="feedback-field">
                                            <input
                                                type="text"
                                                placeholder="Nom"
                                                required
                                                value={feedbackForm.lastname}
                                                disabled={status.loading}
                                                onChange={(e) =>
                                                    setFeedbackForm({
                                                        ...feedbackForm,
                                                        lastname: e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="feedback-input-wrapper">
                                        <textarea
                                            rows="3"
                                            placeholder="Votre message (correction, remarque...)"
                                            value={feedbackForm.comment}
                                            disabled={status.loading}
                                            onChange={(e) =>
                                                setFeedbackForm({
                                                    ...feedbackForm,
                                                    comment: e.target.value
                                                })
                                            }
                                            required
                                        />

                                        <button
                                            type="submit"
                                            className="feedback-send-btn"
                                            disabled={
                                                status.loading ||
                                                !feedbackForm.comment.trim() ||
                                                !feedbackForm.firstname.trim() ||
                                                !feedbackForm.lastname.trim()
                                            }
                                            title="Envoyer le retour"
                                        >
                                            {status.loading ? (
                                                <i className="fas fa-spinner fa-spin" />
                                            ) : (
                                                <i className="fas fa-paper-plane" />
                                            )}
                                        </button>
                                    </div>

                                    {status.error && (
                                        <p className="feedback-msg error">
                                            {status.error}
                                        </p>
                                    )}

                                    {status.success && (
                                        <p className="feedback-msg success">
                                            Retour envoyé avec succès !
                                        </p>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>

                    <footer className="modal-footer">
                        {hasDate ? (
                            <span className="footer-info">
                                Dernière modification le{' '}
                                <strong>{item.date}</strong>
                            </span>
                        ) : (
                            <span className="footer-info error">
                                <i className="fas fa-exclamation-circle" />
                                {' '}
                                Date de modification manquante
                            </span>
                        )}

                        {hasCredits && (
                            <span className="footer-info credits">
                                <strong>Crédits :</strong>{' '}
                                {item.credits}
                            </span>
                        )}
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default ResourceViewerModal;
