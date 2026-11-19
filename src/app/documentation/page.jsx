import DockNav from '../../assets/components/DockNav';

export const metadata = {
    title: 'Documentation API | Ewen Rodrigues de Oliveira',
    description: 'Documentation des endpoints publics du portfolio.',
};

const endpoints = [
    {
        method: 'GET',
        path: '/api/resources',
        description: 'Récupère l’arborescence complète des ressources universitaires au format JSON.',
        parameters: null,
        responseType: 'application/json',
        example: `[
  {
    "name": "Mathématiques",
    "slug": "mathematiques",
    "children": [
      {
        "name": "Licence 1",
        "slug": "licence-1",
        "children": []
      }
    ]
  }
]`,
        errorExample: `{
  "error": "Impossible de charger les ressources."
}`,
    },
    {
        method: 'GET',
        path: '/api/calendar',
        description: 'Récupère le calendrier des visioconférences au format iCalendar.',
        parameters: null,
        responseType: 'text/calendar',
        example: `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:event-123
SUMMARY:Visioconférence
DTSTART:20261120T140000Z
DTEND:20261120T150000Z
END:VEVENT
END:VCALENDAR`,
        errorExample: `{
  "error": "Impossible de synchroniser le calendrier."
}`,
    },
    {
        method: 'POST',
        path: '/api/send-email',
        description: 'Envoie un retour sur une ressource ou propose une nouvelle ressource par e-mail.',
        parameters: [
            { name: 'type', required: true, type: 'string', description: '`feedback` ou `suggestion`.' },
            { name: 'firstname', required: true, type: 'string', description: 'Prénom de l’expéditeur.' },
            { name: 'lastname', required: true, type: 'string', description: 'Nom de l’expéditeur.' },
            { name: 'resourceTitle', required: 'feedback', type: 'string', description: 'Titre de la ressource concernée.' },
            { name: 'resourceSlug', required: 'feedback', type: 'string', description: 'Slug de la ressource concernée.' },
            { name: 'comment', required: 'feedback', type: 'string', description: 'Commentaire ou correction à transmettre.' },
            { name: 'contact', required: 'suggestion', type: 'string', description: 'Moyen de contact proposé.' },
            { name: 'resourceLink', required: 'suggestion', type: 'string', description: 'Lien vers la ressource proposée.' },
            { name: 'consent', required: 'suggestion', type: 'boolean', description: 'Acceptation de la publication éventuelle.' },
        ],
        responseType: 'application/json',
        example: `{
  "success": true
}`,
        errorExample: `{
  "error": "Veuillez patienter 42 secondes."
}`,
    },
];

export default function DocumentationPage() {
    return (
        <div className="documentation-page">
            <main className="documentation-shell">
                <section className="documentation-copy">
                    <span className="documentation-kicker">Documentation technique</span>
                    <h1>Endpoints publics</h1>
                    <p>
                        Référence des accès disponibles pour utiliser les données et les fonctionnalités du portfolio.
                    </p>
                </section>

                <section className="documentation-explorer" aria-label="Documentation des endpoints">
                    {endpoints.map((endpoint) => (
                        <article className="api-card" key={`${endpoint.method}-${endpoint.path}`}>
                            <header className="api-card-header">
                                <span className={`api-method api-method-${endpoint.method.toLowerCase()}`}>
                                    {endpoint.method}
                                </span>
                                <code className="api-path">{endpoint.path}</code>
                            </header>

                            <p className="api-description">{endpoint.description}</p>

                            {endpoint.parameters && (
                                <div className="api-section">
                                    <h2>Corps de la requête</h2>
                                    <div className="api-table-wrap">
                                        <table className="api-table">
                                            <thead>
                                                <tr>
                                                    <th>Paramètre</th>
                                                    <th>Type</th>
                                                    <th>Condition</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {endpoint.parameters.map((parameter) => (
                                                    <tr key={parameter.name}>
                                                        <td><code>{parameter.name}</code></td>
                                                        <td>{parameter.type}</td>
                                                        <td>{parameter.required === true ? 'Obligatoire' : `Requis pour ${parameter.required}`}</td>
                                                        <td>{parameter.description}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <h3>Exemple de body</h3>
                                    <pre><code>{`{
  "type": "feedback",
  "firstname": "Jean",
  "lastname": "Dupont",
  "resourceTitle": "Analyse 2",
  "resourceSlug": "analyse-2-integration",
  "comment": "Une erreur semble présente page 12."
}`}</code></pre>
                                    <h3>Exemple de suggestion</h3>
                                    <pre><code>{`{
  "type": "suggestion",
  "firstname": "Jean",
  "lastname": "Dupont",
  "contact": "jean.dupont@example.com",
  "resourceLink": "https://example.com/ressource.pdf",
  "consent": true
}`}</code></pre>
                                </div>
                            )}

                            <div className="api-section">
                                <h2>Retour attendu</h2>
                                <span className="api-content-type">{endpoint.responseType}</span>
                                <pre><code>{endpoint.example}</code></pre>
                            </div>

                            <div className="api-section api-error-section">
                                <h2>Exemple d’erreur</h2>
                                <pre><code>{endpoint.errorExample}</code></pre>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
            <DockNav />
        </div>
    );
}
