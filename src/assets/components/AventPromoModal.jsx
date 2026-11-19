import { useEffect } from 'react';

export default function AventPromoModal({ isOpen, onClose, onDiscover }) {
    useEffect(() => {
        if (!isOpen) return undefined;

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="avent-modal-backdrop" onClick={onClose}>
            <div
                className="avent-festive-popup"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="avent-festive-title"
            >
                <div className="festive-decorations" aria-hidden="true">
                    <i className="fas fa-snowflake deco-item deco-flake-1" />
                    <i className="fas fa-snowflake deco-item deco-flake-2" />
                    <i className="fas fa-snowflake deco-item deco-flake-3" />
                    <i className="fas fa-infinity deco-item deco-math-1" />
                    <i className="fas fa-superscript deco-item deco-math-2" />
                    <i className="fas fa-shapes deco-item deco-math-3" />
                </div>

                <button
                    type="button"
                    className="festive-close-btn"
                    onClick={onClose}
                    aria-label="Fermer la fenêtre"
                >
                    <i className="fas fa-times" />
                </button>

                <div className="festive-content">
                    <h2 id="avent-festive-title" className="festive-script-title">
                        <span className="script-top">L’Avent des</span>
                        <span className="script-main">Mathématiciens</span>
                    </h2>

                    <p className="festive-lead">
                        24 questions pour préparer les <strong>examens</strong>
                    </p>
                    <p className="festive-sub">
                        Une nouvelle question chaque jour du 1er au 24 décembre, avec son corrigé détaillé dès le lendemain pour préparer les examens de licence 3.
                    </p>

                    <div className="festive-cta-group">
                        <button
                            type="button"
                            className="festive-pill-btn"
                            onClick={onDiscover}
                        >
                            Ouvrir la case du jour
                        </button>

                        <button
                            type="button"
                            className="festive-later-link"
                            onClick={onClose}
                        >
                            Plus tard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}