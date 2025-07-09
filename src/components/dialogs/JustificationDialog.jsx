import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

export default function JustificationDialog({ visible, onHide, task, onSubmit }) {
  const [comment, setComment] = useState("");
  const [media, setMedia] = useState(null);

  // Reset à l'ouverture/fermeture
  useEffect(() => {
    if (visible) {
      setComment("");
      setMedia(null);
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!comment.trim()) {
      alert("Merci de fournir un commentaire de justification.");
      return;
    }
    onSubmit(comment, media);
  };

  return (
    <Dialog
      header={`Justifier la tâche : ${task?.description || ""}`}
      visible={visible}
      style={{ width: "400px" }}
      modal
      onHide={onHide}
      footer={
        <>
          <Button label="Annuler" icon="pi pi-times" onClick={onHide} className="p-button-text" />
          <Button label="Envoyer" icon="pi pi-check" onClick={handleSubmit} />
        </>
      }
    >
      <div className="p-fluid">
        <label htmlFor="justificationComment">Commentaire</label>
        <InputTextarea
          id="justificationComment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          autoFocus
          placeholder="Expliquez pourquoi vous avez accompli cette tâche"
        />

        <label htmlFor="justificationMedia" className="mt-3">
          Joindre un média (optionnel)
        </label>
        <input
          type="file"
          id="justificationMedia"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
        />
      </div>
    </Dialog>
  );
}
