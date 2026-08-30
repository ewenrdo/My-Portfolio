import React, { useState, useMemo } from 'react';
import '../../assets/stylesheets/alimentation.scss';
import DockNav from '../../assets/components/DockNav';
import FOODS from './aliments.json';

export default function AlimentationCochonInde() {
    const [foodTypeMode, setFoodTypeMode] = useState('légume');
    const [searchQuery, setSearchQuery] = useState('');

    // Filtrage dynamique selon la recherche et le type actif (légume vs fruit)
    const filteredFoods = useMemo(() => {
        return FOODS.filter((item) => {
            const matchesType = item.type === foodTypeMode;
            const matchesSearch = item.nom.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                item.remarque.toLowerCase().includes(searchQuery.toLowerCase().trim());
            return matchesType && matchesSearch;
        });
    }, [foodTypeMode, searchQuery]);

    // Formatage des badges de statut
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'oui':
                return 'badge-status status-yes';
            case 'limité':
                return 'badge-status status-limited';
            case 'toxique':
                return 'badge-status status-toxic';
            default:
                return 'badge-status';
        }
    };

    return (
        <div className="ressources-clone-page food-guide-page">
            <main className="ressources-clone-shell">
                
                {/* En-tête de la page */}
                <section className="clone-shell-copy">
                    <span className="clone-kicker">Guide Alimentaire Cobaye</span>
                    <h1>Alimentation du Cochon d'Inde</h1>
                    <p>
                        Retrouvez la liste des légumes, fruits et herbes/bois adaptés aux besoins quotidiens du cochon d'Inde.
                    </p>
                </section>

                <section className="apple-explorer" aria-label="Base de données alimentaire">
                    
                    {/* Switcher de mode : Légumes vs Fruits vs Herbes */}
                    <div 
                        className={`resource-mode-switch ${foodTypeMode === 'légume' ? 'vegetables' : foodTypeMode === 'fruits' ? 'fruits' : 'herbs'}`} 
                        role="tablist" 
                        aria-label="Catégorie d'aliments"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={foodTypeMode === 'légume'}
                            className={`resource-mode-option vegetables ${foodTypeMode === 'légume' ? 'is-active' : ''}`}
                            onClick={() => setFoodTypeMode('légume')}
                        >
                            <i className="fas fa-carrot" />
                            <span>Légumes</span>
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={foodTypeMode === 'fruit'}
                            className={`resource-mode-option fruits ${foodTypeMode === 'fruit' ? 'is-active' : ''}`}
                            onClick={() => setFoodTypeMode('fruit')}
                        >
                            <i className="fas fa-apple-alt" />
                            <span>Fruits</span>
                        </button>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={foodTypeMode === 'herbe'}
                            className={`resource-mode-option herbs ${foodTypeMode === 'herbe' ? 'is-active' : ''}`}
                            onClick={() => setFoodTypeMode('herbe')}
                        >
                            <i className="fas fa-leaf" />
                            <span>Herbes</span>
                        </button>
                    </div>

                    {/* Barre de recherche Apple-like */}
                    <div className="apple-search-wrapper">
                        <i className="fas fa-search apple-search-icon" aria-hidden="true" />
                        <input
                            type="text"
                            className="apple-search-input"
                            placeholder={`Rechercher un ${foodTypeMode === 'légume' ? 'légume' : 'fruit'}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="apple-search-clear"
                                onClick={() => setSearchQuery('')}
                                aria-label="Effacer la recherche"
                            >
                                <i className="fas fa-times-circle" />
                            </button>
                        )}
                    </div>

                    {/* Tableau responsive style Markdown Viewer */}
                    <div className="food-table-container md-viewer">
                        {filteredFoods.length > 0 ? (
                            <div className="table-responsive-wrapper">
                                <table className="food-table">
                                    <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Consommable</th>
                                            <th>Fréquence</th>
                                            <th>Quantité</th>
                                            <th>Remarque</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFoods.map((food) => (
                                            <tr key={food.id}>
                                                <td className="food-name-cell">
                                                    <strong>{food.nom}</strong>
                                                </td>
                                                <td>
                                                    <span className={getStatusBadgeClass(food.consommable)}>
                                                        {food.consommable}
                                                    </span>
                                                </td>
                                                <td>{food.frequence}</td>
                                                <td><code>{food.quantite}</code></td>
                                                <td className="food-remark-cell">{food.remarque}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="apple-feedback apple-feedback-subtle">
                                Aucun {foodTypeMode} ne correspond à votre recherche "{searchQuery}".
                            </p>
                        )}
                    </div>

                </section>
            </main>

            {/* Navigation fixe en bas */}
            <DockNav />

            {/* Orbes de couleur d'arrière-plan */}
            <div className="clone-glow clone-glow-a" aria-hidden="true" />
            <div className="clone-glow clone-glow-b" aria-hidden="true" />
        </div>
    );
}