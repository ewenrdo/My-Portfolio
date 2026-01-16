import React, { useState } from "react";
import "./BlurForm.scss";

const GROUPS = [
    "L2 MATH-INFO 1",
    "L2 MATH-INFO 2",
    "L2 MATH1",
    "L2 MATH2",
    "L2 MATH3",
    "L2 MATH4",
    "Autre"
];

export default function BlurForm({ open, onClose }) {

    if (!open) return null;

    // On ferme le formulaire après soumission
    const handleSubmit = (e) => {
        // Laisse le submit natif, mais ferme le modal
        setTimeout(() => {
            if (onClose) onClose();
        }, 100);
    };

    return (
        <div className="blur-form-overlay">
            <div className="blur-form-modal">
                <h2>Inscription au groupe</h2>
                <p>Pour continuer à maintenir la page de ressources et de publier le cours, nous avons besoin de savoir combien de personnes lisent réellement ce contenu. Merci de bien vouloir remplir ce formulaire pour vous inscrire à un groupe.<br /><br />
                    <b>Remplir ce formulaire est obligatoire pour poursuivre. Il est anonyme.</b>
                </p>
                <form action="https://formspree.io/f/xdaaanvb" method="POST" target="_blank" onSubmit={handleSubmit}>
                    <label>
                        Groupe
                        <select name="groupe" required>
                            <option value="">Choisir un groupe...</option>
                            {GROUPS.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Prénom (facultatif) <span style={{color:'#888',fontSize:'0.95em'}}>- pour vous connaître un peu mieux 😉</span>
                        <input type="text" name="prenom" placeholder="Prénom (optionnel)" />
                    </label>
                    <button type="submit" className="btn btn-black mb-2">Envoyer</button>
                </form>
            </div>
        </div>
    );
}