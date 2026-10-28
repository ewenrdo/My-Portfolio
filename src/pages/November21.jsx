import React, { useEffect, useRef, useState } from 'react';
import '../assets/stylesheets/november21.scss';

export default function November21() {
    const invitationMoments = [
        {
            id: 'spa',
            time: 'Matin',
            title: 'Moment piscine',
            text: 'Pour profiter d\'une matinée de détente tous les deux',
            location: 'La Vague',
            accent: '#7cc6ff',
            glow: 'rgba(124, 198, 255, 0.22)',
        },
        {
            id: 'restaurant',
            time: 'Midi',
            title: 'Raclette',
            text: 'Parce que parler c\'est bien, mais parfois manger c\'est mieux. Et puis, on a faim !',
            accent: '#ff9f5a',
            glow: 'rgba(255, 159, 90, 0.2)',
        },
        {
            id: 'walk',
            time: 'Après manger',
            title: 'Balade',
            text: 'Pour digérer et profiter d\'un moment de calme, main dans la main, en allant chercher quelques douceurs pour le reste de la journée...',
            accent: '#de6d73',
            glow: 'rgba(222, 109, 115, 0.18)',
        },
        {
            id: 'disney',
            time: 'Après-midi',
            title: 'Goûter et disney',
            text: 'Parce que le goûter c\'est sacré, et que tu aimes bien les petits Disney et que c\'est encore mieux à deux !',
            accent: '#dea96d',
            glow: 'rgba(222, 169, 109, 0.18)',
        },
    ];

    const [isVibrating, setIsVibrating] = useState(false);
    const [hearts, setHearts] = useState([]);
    const [isNoThanksTeleporting, setIsNoThanksTeleporting] = useState(false);
    const [noThanksPosition, setNoThanksPosition] = useState({ left: 78, top: 14 });
    const itineraryScrollRef = useRef(null);
    const [visibleMoments, setVisibleMoments] = useState(() => new Set());

    const heartCount = 10;

    const createHearts = () => {
        const nextHearts = Array.from({ length: heartCount }, (_, index) => ({
            id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
            left: 50 + (Math.random() * 34 - 17),
            bottom: 30 + Math.random() * 10,
            size: 14 + Math.random() * 18,
            drift: (Math.random() * 2 - 1) * 90,
            rise: 110 + Math.random() * 80,
            rotate: (Math.random() * 2 - 1) * 45,
            delay: index * 35,
            duration: 900 + Math.random() * 420,
            opacity: 0.55 + Math.random() * 0.35,
        }));

        const nextFlames = Array.from({ length: 6 }, (_, index) => ({
            id: `${Date.now()}-flame-${index}-${Math.random().toString(16).slice(2)}`,
            left: 50 + (Math.random() * 26 - 13),
            bottom: 28 + Math.random() * 10,
            size: 16 + Math.random() * 20,
            drift: (Math.random() * 2 - 1) * 70,
            rise: 120 + Math.random() * 90,
            rotate: (Math.random() * 2 - 1) * 30,
            delay: 50 + index * 40,
            duration: 900 + Math.random() * 360,
            opacity: 0.45 + Math.random() * 0.25,
        }));

        setHearts([
            ...nextHearts.map((heart) => ({ ...heart, kind: 'heart' })),
            ...nextFlames.map((flame) => ({ ...flame, kind: 'flame' })),
        ]);
    };

    const handleLoveClick = () => {
        setIsVibrating(true);
        createHearts();

        window.clearTimeout(window.__novemberVibeTimer);
        window.__novemberVibeTimer = window.setTimeout(() => {
            setIsVibrating(false);
        }, 320);

        window.clearTimeout(window.__novemberHeartTimer);
        window.__novemberHeartTimer = window.setTimeout(() => {
            setHearts([]);
        }, 1600);
    };

    const teleportNoThanks = () => {
        const nextPosition = {
            left: 12 + Math.random() * 76,
            top: 12 + Math.random() * 74,
        };

        setNoThanksPosition(nextPosition);
        setIsNoThanksTeleporting(true);

        window.clearTimeout(window.__novemberNoThanksTimer);
        window.__novemberNoThanksTimer = window.setTimeout(() => {
            setIsNoThanksTeleporting(false);
        }, 420);
    };

    useEffect(() => {
        const metaTags = ['robots', 'googlebot'].map((name) => {
            let metaTag = document.querySelector(`meta[name="${name}"]`);
            const previousContent = metaTag?.getAttribute('content');
            const wasCreated = !metaTag;

            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.setAttribute('name', name);
                document.head.appendChild(metaTag);
            }

            metaTag.setAttribute('content', 'noindex, nofollow');

            return { metaTag, previousContent, wasCreated };
        });

        return () => {
            metaTags.forEach(({ metaTag, previousContent, wasCreated }) => {
                if (wasCreated) {
                    metaTag.remove();
                } else if (previousContent) {
                    metaTag.setAttribute('content', previousContent);
                } else {
                    metaTag.removeAttribute('content');
                }
            });
        };
    }, []);

    useEffect(() => {
        const scrollContainer = itineraryScrollRef.current;

        if (!scrollContainer) {
            return undefined;
        }

        const observedItems = Array.from(scrollContainer.querySelectorAll('[data-moment-id]'));
        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleMoments((currentVisible) => {
                    const nextVisible = new Set(currentVisible);

                    entries.forEach((entry) => {
                        const momentId = entry.target.getAttribute('data-moment-id');

                        if (!momentId) {
                            return;
                        }

                        if (entry.isIntersecting) {
                            nextVisible.add(momentId);
                        }
                    });

                    return nextVisible;
                });
            },
            {
                root: scrollContainer,
                threshold: 0.35,
            }
        );

        observedItems.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="november-page">
            <main className="november-shell" aria-label="Page 21 November">
                <div className="november-heart-layer" aria-hidden="true">
                    {hearts.map((heart) => (
                        <span
                            key={heart.id}
                            className={`november-particle november-${heart.kind}`}
                            style={{
                                left: `${heart.left}%`,
                                bottom: `${heart.bottom}%`,
                                width: `${heart.size}px`,
                                height: `${heart.size}px`,
                                '--heart-drift': `${heart.drift}px`,
                                '--heart-rise': `${heart.rise}px`,
                                '--heart-rotate': `${heart.rotate}deg`,
                                '--heart-delay': `${heart.delay}ms`,
                                '--heart-duration': `${heart.duration}ms`,
                                '--heart-opacity': heart.opacity,
                            }}
                        >
                            {heart.kind === 'flame' ? '🔥' : '♥'}
                        </span>
                    ))}
                </div>

                <div className="november-stage">
                    <article className={`november-invitation-card${isVibrating ? ' is-vibrating' : ''}`} aria-label="Carte d'invitation pour nos 4 ans">
                        <div className="november-invitation-topline">
                            <span className="november-kicker">Invitation pour Madame Tête de linotte</span>
                            <span className="november-date-pill">21.XI.2026</span>
                        </div>

                        <div className="november-invitation-heading">
                            <p className="november-invitation-eyebrow"><i>À celle que j'aime</i>, veux-tu passer cette journée avec moi</p>
                            <h1>pour nos 4 ans ?</h1>
                        </div>

                        <div className="november-itinerary-scroll" ref={itineraryScrollRef}>
                            <div className="november-itinerary" role="list" aria-label="Parcours de la journée">
                            {invitationMoments.map((moment, index) => (
                                <section
                                    key={moment.id}
                                    role="listitem"
                                    data-moment-id={moment.id}
                                    className={`november-itinerary-item${index === invitationMoments.length - 1 ? ' is-terminal' : ''}${visibleMoments.has(moment.id) ? ' is-visible' : ''}`}
                                    style={{ '--moment-accent': moment.accent, '--moment-glow': moment.glow }}
                                >
                                    <div className="november-itinerary-marker" aria-hidden="true">
                                        <span className="november-itinerary-dot" />
                                        <span className="november-itinerary-connector" />
                                    </div>

                                    <div className="november-itinerary-content">
                                        <div className="november-itinerary-content-header">
                                            <span className="november-itinerary-time">{moment.time}</span>
                                            <h2>{moment.title}</h2>
                                        </div>
                                        <p>{moment.text}</p>
                                        {moment.location && (
                                            <div className="november-itinerary-location" aria-label={moment.location}>
                                                <i className="fas fa-map-marker-alt" aria-hidden="true" />
                                                <span>{moment.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            ))}
                            </div>
                        </div>

                        <div className="november-card-footer">
                            <p>
                                Je ne fais que proposer, on peut faire autre chose si tu préfères. Le plus important, c'est d'être tous les deux !
                            </p>

                            <div className="cta-section november-cta-section">
                                <button type="button" className={`btn btn-black mb-2 november-love-button${isVibrating ? ' is-vibrating' : ''}`} onClick={handleLoveClick}>
                                    Avec plaisir !
                                </button>
                            </div>

                            <div className="november-no-thanks-row">
                                <button
                                    type="button"
                                    className={`november-no-thanks${isNoThanksTeleporting ? ' is-teleporting' : ''}`}
                                    onMouseEnter={teleportNoThanks}
                                    onFocus={teleportNoThanks}
                                    style={isNoThanksTeleporting ? {
                                        left: `${noThanksPosition.left}%`,
                                        top: `${noThanksPosition.top}%`,
                                    } : undefined}
                                    aria-label="Non merci"
                                >
                                    non merci
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                <h1 className="sr-only">21 November</h1>
            </main>

        </div>
    );
}
