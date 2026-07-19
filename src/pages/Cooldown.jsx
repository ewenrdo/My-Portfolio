import React, { useEffect, useState } from 'react';
import DockNav from '../assets/components/DockNav';
import '../assets/stylesheets/cooldown.scss';

const END_DATE = '2026-10-23 12:45:00';
const TARGET_TIME = new Date(END_DATE.replace(' ', 'T')).getTime();

const MESSAGES = [
    'Les prochaines vacances se rapprochent à grands pas.',
    'Dernière ligne droite avant de décrocher un peu.',
    'Encore quelques jours avant le grand départ en vacances.',
    'Le compte à rebours tourne vers les vacances.',
    'Bientôt le moment de penser aux prochaines vacances.',
    'Le temps passe vite, les vacances approchent.',
    'Encore un peu de patience avant de profiter des vacances.'
];

const getCountdownParts = () => {
    const totalSeconds = Math.max(0, Math.floor((TARGET_TIME - Date.now()) / 1000));

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalSeconds };
};

export default function Cooldown() {
    const [countdown, setCountdown] = useState(getCountdownParts);
    const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

    useEffect(() => {
        const updateCountdown = () => setCountdown(getCountdownParts());

        updateCountdown();
        const intervalId = window.setInterval(updateCountdown, 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    const countdownItems = [
        { label: 'Jours', value: countdown.days },
        { label: 'Heures', value: countdown.hours },
        { label: 'Minutes', value: countdown.minutes },
        { label: 'Secondes', value: countdown.seconds },
    ];

    return (
        <div className="cooldown-page">
            <main className="cooldown-shell">
                <section className="cooldown-copy">
                    <span className="cooldown-kicker">Prochaines vacances</span>
                    <h1>Encore un peu de patience</h1>
                    <p>
                        Le minuteur ci-dessous suit en temps réel la date des prochaines vacances: {new Date(TARGET_TIME).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} à {new Date(TARGET_TIME).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.
                    </p>

                    <div className="cooldown-status">
                        <span className="cooldown-status-dot" />
                        <span>{countdown.totalSeconds > 0 ? 'C\'est bientôt les vacances' : 'Vive les vacances !'}</span>
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