import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// URL de base officielle de l'API MineStrator
const MINESTRATOR_API_BASE = 'https://mine.sttr.io';

export default async function handler(req, res) {
    const apiKey = process.env.MINESTRATOR_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Clé API MineStrator non configurée.' });
    }

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };

    try {
        // --- GET : Récupérer le statut et les informations du serveur ---
        if (req.method === 'GET') {
            const { serverId } = req.query;

            if (!serverId) {
                return res.status(400).json({ error: 'L\'ID du serveur (serverId) est requis.' });
            }

            // Récupération des informations et statistiques live du serveur
            const [serverRes, liveRes] = await Promise.all([
                fetch(`${MINESTRATOR_API_BASE}/server/${serverId}`, { headers }),
                fetch(`${MINESTRATOR_API_BASE}/server/${serverId}/live`, { headers })
            ]);

            if (!serverRes.ok) {
                const errorData = await serverRes.json().catch(() => ({}));
                return res.status(serverRes.status).json({ 
                    error: errorData.message || 'Erreur lors de la récupération des données du serveur.' 
                });
            }

            const serverData = await serverRes.json();
            const liveData = liveRes.ok ? await liveRes.json() : null;

            // Détermination de l'état (ex: 'ON', 'OFF', 'STARTED', 'STARTING')
            const status = liveData?.data?.status || serverData?.data?.status || 'OFFLINE';
            const players = liveData?.data?.players || serverData?.data?.players || [];
            const serverName = serverData?.data?.name || 'Mon Serveur Minecraft';

            return res.status(200).json({
                status,
                players,
                serverName,
            });
        }

        // --- POST : Actions sur le serveur (start, stop, restart) ---
        if (req.method === 'POST') {
            const { serverId, action } = req.body;

            if (!serverId || !action) {
                return res.status(400).json({ error: 'L\'ID du serveur et l\'action sont requis.' });
            }

            if (!['start', 'stop', 'restart', 'kill'].includes(action)) {
                return res.status(400).json({ error: 'Action invalide.' });
            }

            // Appel à l'endpoint /power de MineStrator
            const response = await fetch(`${MINESTRATOR_API_BASE}/server/${serverId}/power`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ poweraction: action }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return res.status(response.status).json({ 
                    error: data.message || 'Erreur lors de l\'exécution de l\'action.' 
                });
            }

            return res.status(200).json({ success: true, data });
        }

        return res.status(405).json({ error: 'Méthode non autorisée.' });
    } catch (error) {
        console.error('Erreur API MineStrator:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur lors du traitement de la requête.' });
    }
}