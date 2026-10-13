import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// URL de base officielle MineStrator d'après la documentation OpenAPI
const MINESTRATOR_API_BASE = 'https://mine.sttr.io';

export default async function handler(req, res) {
    const apiKey = process.env.MINESTRATOR_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            error: 'Clé API MineStrator non configurée dans la variable d\'environnement MINESTATOR_API_KEY.'
        });
    }

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // Helper fetch pour capturer et logger proprement les erreurs HTTP / HTML
    async function fetchJson(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers },
        });

        const text = await response.text();

        try {
            const data = JSON.parse(text);
            return { ok: response.ok, status: response.status, data };
        } catch (err) {
            console.error(`[MineStrator API Error] Réponse non-JSON depuis ${url} (HTTP ${response.status}):\n`, text.substring(0, 300));
            throw new Error(`Le serveur MineStrator a renvoyé un code HTTP ${response.status}. Vérifiez votre clé API et l'ID du serveur.`);
        }
    }

    try {
        // --- GET : Récupérer les informations du serveur ---
        if (req.method === 'GET') {
            const { serverId } = req.query;

            if (!serverId) {
                return res.status(400).json({ error: 'L\'ID du serveur (serverId) est requis.' });
            }

            const { ok, status, data } = await fetchJson(`${MINESTRATOR_API_BASE}/server/${serverId}`);

            if (!ok) {
                // Renvoyer le message exact fourni par l'API MineStrator
                return res.status(status).json({
                    error: data?.message || data?.error || `Action refusée par MineStrator (Code HTTP ${status}).`
                });
            }

            const serverInfo = data?.data || {};

            return res.status(200).json({
                status: serverInfo.status || 'OFFLINE',
                players: serverInfo.players || [],
                serverName: serverInfo.name || 'Mon Serveur Minecraft',
            });
        }

        // --- POST : Action d'alimentation ---
        if (req.method === 'POST') {
            const { serverId, action } = req.body;

            if (!serverId || !action) {
                return res.status(400).json({ error: 'L\'ID du serveur et l\'action sont requis.' });
            }

            // Cartographie des actions autorisées par l'API
            const validActions = ['start', 'restart', 'restart10', 'stop', 'stop10', 'kill'];
            if (!validActions.includes(action)) {
                return res.status(400).json({ error: `Action invalide. Actions valides : ${validActions.join(', ')}` });
            }

            // L'API MineStrator utilise PUT /server/{id_server}/poweraction
            const { ok, status, data } = await fetchJson(`${MINESTRATOR_API_BASE}/server/${serverId}/poweraction`, {
                method: 'PUT',
                body: JSON.stringify({ poweraction: action }),
            });

            
            if (!ok) {
                // Renvoyer le message exact fourni par l'API MineStrator
                return res.status(status).json({
                    error: data?.message || data?.error || `Action refusée par MineStrator (Code HTTP ${status}).`
                });
            }

            return res.status(200).json({ success: true, data });
        }

        return res.status(405).json({ error: 'Méthode non autorisée.' });

    } catch (error) {
        console.error('Erreur interne API:', error.message);
        return res.status(500).json({ error: error.message });
    }
}