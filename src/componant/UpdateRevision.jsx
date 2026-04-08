import './ModalRevision.scss';

const changelog = [
    {
        date: '2026-04-08',
        items: [
            'Ajout d\'un bouton qui permet de copier le lien d\'une ressource dans le presse-papier, pour faciliter le partage dudit fichier.',
        ],
    },
    {
        date: '2026-03-30',
        items: [
            'Ajout de la matière "Élément d\'algorithmique" dans le simulateur de note.',
        ],
    },
    {
        date: '2026-03-27',
        items: [
            'Ajout d\'un simulateur de note pour les étudiants de la double-licence L2,',
            'Ajout d\'un champ de recherche pour trouver rapidement une ressource,',
            'Implémentation d\'un popup qui informe des dernières mises à jour de la section Ressources,',
            'Amélioration des sommaires dans les cours de mathématiques du semestre 3,',
            'Ajout d\'une section TEDs, inutile pour les étudiants qui ne sont pas dans mon groupe,',
            'Ajout d\'un popup d\'encouragement pour les révisions de partiel.',
        ],
    }
];

const UpdateRevision = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleAcknowledge = () => {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        localStorage.setItem('ressources-last-seen', today);
        onClose();
    };

    return (
        <div className="modal-revision-overlay">
            <div className="modal-revision-content">
                <h2>Il y a du nouveau ici !</h2>
                <p>Voici les dernières mises à jour du site depuis votre dernière visite :</p>
                <small><i className="fa fa-info-circle text-danger me-2" /> Les modifications des fichiers ne sont pas listées ici, seulement les changements de fonctionnalités ou de design.</small>
                <div className="changelog-list">
                    {changelog.map((entry) => (
                        <div key={entry.date} className="changelog-entry">
                            <div className="changelog-date">{entry.date}</div>
                            <ul>
                                {entry.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <button className="modal-revision-close" onClick={handleAcknowledge}>J'ai compris</button>
            </div>
        </div>
    );
};

export default UpdateRevision;
