import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MINESTRATOR_API_BASE = 'https://mine.sttr.io';

export default async function handler(req, res) {
    const key = process.env.MINESTRATOR_API_KEY;
    console.error('MINESTRATOR_API_KEY:', key ? 'Clé API configurée et vaut : ' + key : 'Clé API non configurée.');

    if (!key) {
        return res.status(500).json({ 
            error: 'Clé API MineStrator non configurée (MINESTATOR_API_KEY).' 
        });
    }

    try {
        // --- GET : Récupérer les données du serveur ---
        if (req.method === 'GET') {
            const { serverId } = req.query;

            if (!serverId) {
                return res.status(400).json({ error: 'L\'ID du serveur (serverId) est requis.' });
            }

            const response = await fetch(`${MINESTRATOR_API_BASE}/server/${serverId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Accept': 'application/json',
                },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return res.status(response.status).json({ 
                    error: data?.message || `Erreur serveur MineStrator (HTTP ${response.status}).` 
                });
            }

            const serverInfo = data?.api?.data || data?.data || {};

            return res.status(200).json({
                status: serverInfo.status || 'OFFLINE',
                players: serverInfo.players || [],
                serverName: serverInfo.name || 'Mon Serveur Minecraft',
            });
        }

        // --- POST : Action d'alimentation (start, stop, etc.) ---
        if (req.method === 'POST') {
            const { serverId, action } = req.body;

            if (!serverId || !action) {
                return res.status(400).json({ error: 'L\'ID du serveur et l\'action sont requis.' });
            }

            // Exécution selon l'exemple exact de la documentation MineStrator
            const response = await fetch(`${MINESTRATOR_API_BASE}/server/${serverId}/poweraction`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ poweraction: action }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return res.status(response.status).json({ 
                    error: data?.message || `Erreur MineStrator (HTTP ${response.status}). Vérifiez les permissions de votre clé ou l'ID serveur.` 
                });
            }

            return res.status(200).json({ success: true, data: data?.api?.data || data });
        }

        return res.status(405).json({ error: 'Méthode non autorisée.' });

    } catch (error) {
        console.error('Erreur serveur Vercel:', error);
        return res.status(500).json({ error: error.message || 'Erreur interne du serveur.' });
    }
}