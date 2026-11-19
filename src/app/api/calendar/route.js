const CALENDAR_URL = process.env.CALENDAR_URL;

export async function GET() {
    if (!CALENDAR_URL) {
        return Response.json({ error: 'Calendrier non configuré.' }, { status: 503 });
    }

    try {
        const response = await fetch(CALENDAR_URL, { next: { revalidate: 300 } });
        if (!response.ok) throw new Error(`Calendar responded with ${response.status}`);

        return new Response(await response.text(), {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Erreur de synchronisation du calendrier:', error);
        return Response.json({ error: 'Impossible de synchroniser le calendrier.' }, { status: 502 });
    }
}
