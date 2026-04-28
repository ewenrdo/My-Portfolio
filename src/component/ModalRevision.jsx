import './ModalRevision.scss';

const ModalRevision = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-revision-overlay">
      <div className="modal-revision-content">
        <h2>Bonnes révisions</h2>
        <p>Bon courage pour vos révisions du partiel de samedi 😀<br/>Au besoin n'hésitez pas à me contacter.</p>
        <button className="modal-revision-close" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default ModalRevision;
