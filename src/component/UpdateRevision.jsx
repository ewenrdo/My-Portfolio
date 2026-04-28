import './ModalRevision.scss';

const changelog = [
    {
        date: '2026-04-28',
        items: [
            'Migration du site vers une nouvelle machine (plus rapide, plus fiable, moins coûteuse),',
            'Mise à jour de l\'architecture du site après un an d\'existence, pour plus de maintenabilité',
            'Les fichiers trop lourds ne sont désormais plus affichés par soucis de performance, mais restent téléchargeables via un bouton dédié,',
            'Ajout d\'une icône spécifique pour les liens externes, pour les différencier des autres ressources.',
        ],
    },
    {
        date: '2026-04-13',
        items: [
            'Ajout des feuilles de TD de mathématiques du semestre 4 et réorganisation des cours "Analyse-Algèbre 4" et "Probabilités 4"',
        ],
    },
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

    const lastSeen = localStorage.getItem('ressources-last-seen') || '';
    const unseenChanges = changelog.filter((entry) => entry.date > lastSeen);

    if (unseenChanges.length === 0) return null;

    const handleAcknowledge = () => {
        localStorage.setItem('ressources-last-seen', unseenChanges[0].date);
        onClose();
    };

    return (
        <div className="modal-revision-overlay">
            <div className="modal-revision-content">
                <h2>Il y a du nouveau ici !</h2>
                <p>Voici les dernières mises à jour du site depuis votre dernière visite :</p>
                <div className="changelog-list">
                    {unseenChanges.map((entry) => (
                        <div key={entry.date} className="changelog-entry">
                            <div className="changelog-date">{entry.date}</div>
                            <ul>
                                {entry.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <small><i className="fa fa-info-circle text-danger me-2" /> Les modifications des fichiers ne sont pas listées ici, seulement les changements de fonctionnalités ou de design.</small>
                </div>

                <button className="modal-revision-close" onClick={handleAcknowledge}>J'ai compris</button>
            </div>
        </div>
    );
};

export default UpdateRevision;
