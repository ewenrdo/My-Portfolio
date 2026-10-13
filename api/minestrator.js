import dotenv from 'dotenv';
import path from 'path';

// Chargement des variables d'environnement en local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MINESTRATOR_API_BASE = 'https://api.minestrator.com';

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
        // --- GET : Récupérer le statut du serveur et les joueurs ---
        if (req.method === 'GET') {
            const { serverId } = req.query;

            if (!serverId) {
                return res.status(400).json({ error: 'L\'ID du serveur (serverId) est requis.' });
            }

            // Récupération du statut et des données temps réel du serveur
            const response = await fetch(`${MINESTRATOR_API_BASE}/server/${serverId}`, {
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                return res.status(response.status).json({ error: errorData.message || 'Erreur lors de la récupération des données.' });
            }

            const data = await response.json();

            return res.status(200).json({
                status: data.data?.status || 'OFFLINE',
                players: data.data?.players || [],
                serverName: data.data?.name || 'Mon Serveur Minecraft',
            });
        }

        // --- POST : Actions sur le serveur (Démarrer / Éteindre) ---
        if (req.method === 'POST') {
            const { serverId, action } = req.body;

            if (!serverId || !action) {
                return res.status(400).json({ error: 'L\'ID du serveur et l\'action sont requis.' });
            }

            if (!['start', 'stop', 'restart'].includes(action)) {
                return res.status(400).json({ error: 'Action invalide.' });
            }

            const response = await fetch(`${MINESTRATOR_API_BASE}/server/${serverId}/execute/${action}`, {
                method: 'POST',
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                return res.status(response.status).json({ error: errorData.message || 'Erreur lors de l\'exécution de l\'action.' });
            }

            const data = await response.json();
            return res.status(200).json({ success: true, data });
        }

        return res.status(405).json({ error: 'Méthode non autorisée.' });
    } catch (error) {
        console.error('Erreur API MineStrator:', error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
}