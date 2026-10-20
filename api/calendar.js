const CALENDAR_URL = 'https://calendar.proton.me/api/calendar/v1/url/FXVWefJdoofz1_T4f2tGmjhf3xsfUKKdSWWQFFqWnIeGkX0jIaF2vWtJAEUmGlEi_OhGVpHLdPZDuEvUmFsUsQ==/calendar.ics?CacheKey=AtEJSoUaVTrvzDS9hnYjiQ%3D%3D&PassphraseKey=toaVuEtBhDYsh5Q8Cen986X_SbAjEAez171FYXM6VU8%3D';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const response = await fetch(CALENDAR_URL);
        if (!response.ok) {
            throw new Error(`Le calendrier Proton a répondu avec le statut ${response.status}.`);
        }

        const calendar = await response.text();
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
        return res.status(200).send(calendar);
    } catch (error) {
        console.error('Erreur de synchronisation du calendrier:', error);
        return res.status(502).json({ error: 'Impossible de synchroniser le calendrier.' });
    }
}
