import React, { useState, useRef } from "react";
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
    const [showConfirm, setShowConfirm] = useState(false);
    const [timer, setTimer] = useState(5);
    const formRef = useRef(null);
    const timerRef = useRef();

    // Fermeture du modal de confirmation si on ferme le formulaire
    React.useEffect(() => {
        if (!open) {
            setShowConfirm(false);
            setTimer(5);
            clearInterval(timerRef.current);
        }
    }, [open]);

    if (!open) return null;

    // Validation du formulaire
    const validateForm = () => {
        if (!formRef.current) return false;
        return formRef.current.checkValidity();
    };

    // Gestion du clic sur Envoyer
    const handlePreSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowConfirm(true);
            setTimer(3);
            timerRef.current = setInterval(() => {
                setTimer((t) => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        handleSend();
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        } else {
            formRef.current.reportValidity(); // Affiche les erreurs natives d'HTML
        }
    };

    // Envoi du POST après le timer
    const handleSend = () => {
        if (formRef.current) {
            formRef.current.submit();
            setTimeout(() => {
                if (onClose) onClose();
            }, 100);
        }
    };

    return (
        <div className="blur-form-overlay">
            <div className="blur-form-modal">
                <h2>Inscription au groupe</h2>
                <p>Pour continuer à maintenir la page de ressources et de publier le cours, nous avons besoin de savoir combien de personnes lisent réellement ce contenu. Merci de bien vouloir remplir ce formulaire pour vous inscrire à un groupe.<br /><br />
                    <b>Remplir ce formulaire est obligatoire pour poursuivre.</b>
                </p>
                <form
                    ref={formRef}
                    action="https://formspree.io/f/xdaaanvb"
                    method="POST"
                    target="_blank"
                    onSubmit={handlePreSubmit}
                    noValidate
                >
                    <label>
                        Groupe
                        <select name="groupe" required>
                            <option value="">Choisir un groupe...</option>
                            {GROUPS.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </label>
                    <button type="submit" className="btn btn-black mb-2">Envoyer</button>
                </form>
                {showConfirm && (
                    <div className="blur-form-confirm-modal">
                        <div className="blur-form-confirm-content">
                            <h3>Redirection en cours...</h3>
                            <p>Vous allez être redirigé vers une page dans un nouvel onglet.<br/>
                            Merci de revenir sur cette page et de l'actualiser après avoir validé le formulaire.<br/><br/>
                            Envoi dans <b>{timer}</b> seconde{timer > 1 ? 's' : ''}...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}