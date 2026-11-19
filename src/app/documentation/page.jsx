export const metadata = {
    title: 'Documentation API | Ewen Rodrigues de Oliveira',
    description: 'Documentation des endpoints publics du portfolio.',
};

const endpoints = [
    {
        method: 'GET',
        path: '/api/resources',
        description: 'Récupère l’arborescence des ressources universitaires au format JSON.',
    },
    {
        method: 'GET',
        path: '/api/calendar',
        description: 'Récupère le calendrier de visioconférences au format iCalendar.',
    },
    {
        method: 'POST',
        path: '/api/send-email',
        description: 'Envoie un retour ou une suggestion de ressource par e-mail.',
    },
];

export default function DocumentationPage() {
    return (
        <main className="container py-5">
            <header className="mb-5">
                <p className="text-uppercase text-muted mb-2">Documentation</p>
                <h1>Endpoints publics</h1>
                <p className="lead">
                    Les endpoints disponibles pour accéder aux données et fonctionnalités du site.
                </p>
            </header>

            <div className="row g-4">
                {endpoints.map((endpoint) => (
                    <article className="col-12" key={`${endpoint.method}-${endpoint.path}`}>
                        <div className="border rounded-4 p-4">
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <span className="badge text-bg-dark">{endpoint.method}</span>
                                <code>{endpoint.path}</code>
                            </div>
                            <p className="mb-0">{endpoint.description}</p>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
