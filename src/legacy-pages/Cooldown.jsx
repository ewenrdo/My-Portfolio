'use client';

import React, { useEffect, useState } from 'react';
import DockNav from '../assets/components/DockNav';

const MESSAGES = [
    'Les prochaines vacances se rapprochent à grands pas.',
    'Dernière ligne droite avant de décrocher un peu.',
    'Encore quelques jours avant le grand départ en vacances.',
    'Le compte à rebours tourne vers les vacances.',
    'Bientôt le moment de penser aux prochaines vacances.',
    'Le temps passe vite, les vacances approchent.',
    'Encore un peu de patience avant de profiter des vacances.'
];

const getCountdownParts = (targetTimestamp) => {
    const totalSeconds = targetTimestamp
        ? Math.max(0, Math.floor((targetTimestamp - Date.now()) / 1000))
        : 0;

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalSeconds };
};

export default function Cooldown() {
    const [countdown, setCountdown] = useState(null);
    const [target, setTarget] = useState(null);
    const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    useEffect(() => {
        const controller = new AbortController();

        fetch('/api/holidays-countdown', { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error('Unable to load holidays countdown');
                return response.json();
            })
            .then((data) => {
                setTarget(data);
                setCountdown(getCountdownParts(data.timestamp));
            })
            .catch((error) => {
                if (error.name !== 'AbortError') console.error(error);
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!target) return undefined;

        const updateCountdown = () => setCountdown(getCountdownParts(target.timestamp));

        updateCountdown();
        const intervalId = window.setInterval(updateCountdown, 1000);

        return () => window.clearInterval(intervalId);
    }, [target]);

    const countdownItems = [
        { label: 'Jours', value: countdown?.days ?? 0 },
        { label: 'Heures', value: countdown?.hours ?? 0 },
        { label: 'Minutes', value: countdown?.minutes ?? 0 },
        { label: 'Secondes', value: countdown?.seconds ?? 0 },
    ];

    return (
        <div className="cooldown-page">
            <main className="cooldown-shell">
                <section className="cooldown-copy">
                    <span className="cooldown-kicker">Prochaines vacances</span>
                    <h1>{!target || !countdown ? 'Chargement du minuteur' : countdown.totalSeconds > 0 ? 'Encore un peu de patience' : 'Vive les vacances !'}</h1>
                    <p>
                        Le minuteur <span className="mobile-only">ci-dessous</span><span className="computer-only">ci-contre</span> suit en temps réel la date des prochaines vacances: {target ? new Date(target.timestamp).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Europe/Paris' }) : 'chargement...'} à {target ? new Date(target.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }) : ''}.
                    </p>

                    <div className="cooldown-status">
                        <span className="cooldown-status-dot" />
                        <span>{!target || !countdown ? 'Connexion au minuteur' : countdown.totalSeconds > 0 ? 'C\'est bientôt les vacances' : 'Vive les vacances !'}</span>
                    </div>
                </section>

                <section className="cooldown-panel" aria-label="Compte à rebours en direct">
                    <div className="cooldown-radar" aria-hidden="true">
                        <span className="cooldown-radar-ring cooldown-radar-ring-a" />
                        <span className="cooldown-radar-ring cooldown-radar-ring-b" />
                        <span className="cooldown-radar-core" />
                    </div>

                    <div className="cooldown-countdown">
                        {countdownItems.map((item, index) => (
                            <div className="cooldown-tile" key={item.label} style={{ animationDelay: `${index * 110}ms` }}>
                                <span className="cooldown-value">{String(item.value).padStart(2, '0')}</span>
                                <span className="cooldown-label">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="cooldown-message">
                        <span>Ambiance du moment</span>
                        <p>{message}</p>
                    </div>
                </section>
            </main>

            <DockNav />
        </div>
    );
}
