import './ModalRevision.scss';

const ModalRevision = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-revision-overlay">
      <div className="modal-revision-content">
        <h2>Bonnes révisions</h2>
        <p>Bon courage dans vos révisions pour vos examens😀<br/>Au besoin, un livret "de Pâques" est disponible dans les fiches d'entraînements pour vous préparer.<br/><br/>
        Une erreur ? Des inexactitudes dans les cours ? Envoyez-moi un mail à <a href="mailto:contact@ewenrdo.fr">contact@ewenrdo.fr</a>.
        </p>
        <button className="modal-revision-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default ModalRevision;
