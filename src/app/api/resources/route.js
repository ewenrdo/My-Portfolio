import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'public', 'resources', 'ressources.json');
        const contents = await readFile(filePath, 'utf8');

        return new Response(contents, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        console.error('Erreur de lecture des ressources:', error);
        return Response.json(
            { error: 'Impossible de charger les ressources.' },
            { status: 500 },
        );
    }
}
