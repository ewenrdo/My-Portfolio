import React, { useEffect } from 'react';

function renderInlineMarkdown(text) {
    const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*)/g).filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        if (part.startsWith('__') && part.endsWith('__')) {
            return <span key={index} style={{ textDecoration: 'underline' }}>{part.slice(2, -2)}</span>;
        }

        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index}>{part.slice(1, -1)}</em>;
        }

        return part;
    });
}

function renderWarningContent(text) {
    const lines = text.split(/\r?\n/);
    const blocks = [];
    let bulletItems = [];

    const flushBullets = () => {
        if (!bulletItems.length) return;

        blocks.push(
            <ul key={`bullets-${blocks.length}`} className="warning-list" style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {bulletItems}
            </ul>
        );
        bulletItems = [];
    };

    lines.forEach((line, lineIndex) => {
        const trimmed = line.trim();

        if (!trimmed) {
            flushBullets();
            blocks.push(<div key={`empty-${lineIndex}`} style={{ height: '0.5rem' }} />);
            return;
        }

        if (trimmed.startsWith('* ')) {
            bulletItems.push(
                <li key={`bullet-${lineIndex}`}>{renderInlineMarkdown(trimmed.slice(2))}</li>
            );
            return;
        }

        flushBullets();
        blocks.push(
            <p key={`line-${lineIndex}`} style={{ margin: 0 }}>
                {renderInlineMarkdown(line)}
            </p>
        );
    });

    flushBullets();

    return blocks;
}

export default function WarningModal({ item, isOpen, onClose, onConfirm }) {
    useEffect(() => {
        if (!isOpen || !item) return undefined;

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, item, onClose]);

    if (!isOpen || !item) return null;

    const warningText = typeof item.warning === 'string' ? item.warning.trim() : '';
    const warningContent = warningText ? renderWarningContent(warningText) : null;

    return (
        <div className="apple-modal-overlay" onClick={onClose}>
            <div
                className="apple-modal-container"
                onClick={(e) => e.stopPropagation()}
                style={{ width: 'min(100%, 42rem)', height: 'auto', maxHeight: 'min(90vh, 28rem)' }}
            >
                <header className="apple-modal-header">
                    <div className="header-left">
                        <span className="modal-kicker">Avertissement</span>
                        <h2 className="modal-title">{item.title || item.name}</h2>
                    </div>
                    <div className="header-actions">
                        <button onClick={onClose} className="action-btn close" title="Fermer">
                            <i className="fas fa-times" />
                        </button>
                    </div>
                </header>

                <div className="apple-modal-body">
                    <div className="viewer-placeholder">
                        <i className="fas fa-exclamation-triangle mb-3" style={{ color: '#d3852b', fontSize: '2rem' }} />
                        <div style={{ display: 'grid', gap: '0.75rem', textAlign: 'left' }}>
                            {warningContent}
                        </div>
                        <button type="button" className="apple-btn-primary mt-4" onClick={onConfirm}>
                            Compris
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}