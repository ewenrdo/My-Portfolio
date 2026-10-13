import React, { useState, useEffect, useCallback } from 'react';
import DockNav from '../assets/components/DockNav';
import '../assets/stylesheets/minestrator.scss';

    
const ADMIN_PASSWORD = process.env.MINESTRATOR_PASSWORD || 'foobar'; // Mot de passe par défaut 
const SERVER_ID = '502780'; // Remplacez par l'ID de votre serveur MineStrator

function Minestrator() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasError, setHasError] = useState(false);

    // États reliés à l'API
    const [serverRunning, setServerRunning] = useState(false);
    const [serverName, setServerName] = useState('Survie communautaire');
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Fonction de récupération de l'état du serveur
    const fetchServerData = useCallback(async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            const res = await fetch(`/api/minestrator?serverId=${SERVER_ID}`);

            // Vérification du Content-Type
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                throw new Error(`Réponse non-JSON du serveur (${res.status}) : la route API n'a pas été trouvée.`);
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors du chargement.');
            }

            setServerRunning(data.status === 'STARTED' || data.status === 'STARTING');
            if (data.serverName) setServerName(data.serverName);
            if (Array.isArray(data.players)) setPlayers(data.players);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Charger les données lorsque l'utilisateur s'authentifie
    useEffect(() => {
        if (isAuthenticated) {
            fetchServerData();
            // Optionnel : rafraîchissement automatique toutes les 15 secondes
            const interval = setInterval(fetchServerData, 15000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, fetchServerData]);

    function handlePasswordSubmit(event) {
        event.preventDefault();

        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setHasError(false);
            return;
        }

        setHasError(true);
    }

    // Gestion du démarrage / arrêt du serveur
    async function handleServerAction(action) {
        setIsLoading(true);
        setApiError(null);
        try {
            const res = await fetch('/api/minestrator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serverId: SERVER_ID, action }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erreur lors de l\'action.');
            }

            // Rafraîchir l'état après l'action
            await fetchServerData();
        } catch (err) {
            setApiError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="minestrator-page">
                <main className="minestrator-shell minestrator-auth-shell">
                    <section className="minestrator-shell-copy">
                        <span className="minestrator-kicker">
                            <i className="fas fa-lock" aria-hidden="true" />
                            Accès administrateur
                        </span>
                        <h1>Minestrator</h1>
                        <p>
                            Entrez le mot de passe pour accéder aux commandes du serveur.
                        </p>
                    </section>

                    <form className="minestrator-auth-card" onSubmit={handlePasswordSubmit}>
                        <label htmlFor="minestrator-password">Mot de passe</label>
                        <input
                            id="minestrator-password"
                            type="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setHasError(false);
                            }}
                            className="minestrator-password-input"
                            autoComplete="current-password"
                            autoFocus
                            aria-invalid={hasError}
                            aria-describedby={hasError ? 'minestrator-password-error' : undefined}
                        />
                        {hasError && (
                            <p className="minestrator-auth-error" id="minestrator-password-error">
                                Le mot de passe est incorrect.
                            </p>
                        )}
                        <button type="submit" className="minestrator-button is-primary">
                            <i className="fas fa-arrow-right" aria-hidden="true" />
                            Accéder à l’administration
                        </button>
                    </form>
                </main>
                <DockNav />
            </div>
        );
    }

    const onlinePlayers = players.filter((p) => p.online !== false);

    return (
        <div className="minestrator-page">
            <main className="minestrator-shell">
                <section className="minestrator-shell-copy">
                    <span className="minestrator-kicker">
                        <i className="fas fa-cubes" aria-hidden="true" />
                        Administration Minecraft
                    </span>
                    <h1>Minestrator</h1>
                    <p>
                        Pilotez le serveur et consultez les joueurs présents depuis un espace simple et lisible.
                    </p>
                </section>

                {apiError && (
                    <div className="minestrator-auth-error" style={{ marginBottom: '1rem' }}>
                        {apiError}
                    </div>
                )}

                <section className="minestrator-grid" aria-label="État du serveur">
                    <article className="server-status-card">
                        <div className="card-heading">
                            <div className={`server-icon ${serverRunning ? 'is-running' : 'is-stopped'}`}>
                                <i className={`fas ${serverRunning ? 'fa-play' : 'fa-power-off'}`} aria-hidden="true" />
                            </div>
                            <div>
                                <span className="card-eyebrow">Serveur principal</span>
                                <h2>{serverName}</h2>
                            </div>
                        </div>

                        <div className="server-status">
                            <span className={`status-dot ${serverRunning ? 'is-running' : 'is-stopped'}`} />
                            <strong>{serverRunning ? 'En ligne' : 'Éteint'}</strong>
                            <span className="status-caption">
                                {serverRunning ? 'Le serveur accepte les connexions' : 'Le serveur est actuellement arrêté'}
                            </span>
                        </div>

                        <div className="server-actions">
                            <button
                                type="button"
                                className="minestrator-button is-primary"
                                onClick={() => handleServerAction('start')}
                                disabled={serverRunning || isLoading}
                            >
                                <i className="fas fa-play" aria-hidden="true" />
                                Démarrer
                            </button>
                            <button
                                type="button"
                                className="minestrator-button is-secondary"
                                onClick={() => handleServerAction('stop')}
                                disabled={!serverRunning || isLoading}
                            >
                                <i className="fas fa-stop" aria-hidden="true" />
                                Éteindre
                            </button>
                        </div>
                    </article>

                    <article className="players-summary-card">
                        <span className="card-eyebrow">Activité</span>
                        <div className="players-summary-value">
                            <strong>{players.length}</strong>
                            <span>joueur(s) au total</span>
                        </div>
                        <div className="summary-line">
                            <span className="summary-icon"><i className="fas fa-users" aria-hidden="true" /></span>
                            <span>{onlinePlayers.length} actuellement en ligne</span>
                        </div>
                        <span className="summary-note">Données en direct de l'API MineStrator</span>
                    </article>
                </section>

                <section className="players-panel" aria-labelledby="players-title">
                    <div className="players-panel-header">
                        <div>
                            <span className="card-eyebrow">Serveur principal</span>
                            <h2 id="players-title">Liste des joueurs</h2>
                        </div>
                        <span className="players-count">{players.length} joueurs</span>
                    </div>

                    <div className="players-list">
                        {players.length === 0 ? (
                            <p style={{ padding: '1rem', color: '#666' }}>Aucun joueur connecté pour le moment.</p>
                        ) : (
                            players.map((player, index) => {
                                const name = typeof player === 'string' ? player : player.name || player.username || `Joueur ${index + 1}`;
                                const isOnline = typeof player === 'object' ? player.online !== false : true;

                                return (
                                    <div className="player-row" key={player.id || index}>
                                        <div className="player-avatar" aria-hidden="true">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="player-identity">
                                            <strong>{name}</strong>
                                            {player.playTime && <span>Temps de jeu : {player.playTime}</span>}
                                        </div>
                                        <span className={`player-status ${isOnline ? 'is-online' : 'is-away'}`}>
                                            <span className="status-dot" />
                                            {isOnline ? 'En ligne' : 'Hors ligne'}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </main>

            <DockNav />
        </div>
    );
}

export default Minestrator;