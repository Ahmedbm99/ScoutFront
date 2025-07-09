import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const AddJourneyDialog = ({
  visible,
  onHide,
  newJourneyNumber,
  setNewJourneyNumber,
  newJourneyTheme,
  setNewJourneyTheme,
  newJourneyDate,
  setNewJourneyDate,
  newTasks,
  setNewTasks,
  onSave,
}) => (
  <Dialog header="Ajouter une Journée" visible={visible} style={{ width: "450px" }} modal onHide={onHide}>
    <div className="p-fluid">
      <label>Numéro de la journée</label>
      <InputText
        type="number"
        value={newJourneyNumber}
        onChange={(e) => setNewJourneyNumber(parseInt(e.target.value, 10))}
      />

      <label className="mt-3">Thème de la journée</label>
      <InputText value={newJourneyTheme} onChange={(e) => setNewJourneyTheme(e.target.value)} />

      <label className="mt-3">Date prévue</label>
      <InputText
        type="date"
        value={newJourneyDate}
        onChange={(e) => setNewJourneyDate(e.target.value)}
      />

      <label className="mt-3">Tâches associées</label>
      {newTasks.map((task, idx) => (
        <div key={idx} className="flex mb-2">
          <InputText
            className="flex-grow-1"
            placeholder="Description de la tâche"
            value={task.description}
            onChange={(e) => {
              const updated = [...newTasks];
              updated[idx].description = e.target.value;
              setNewTasks(updated);
            }}
          />
          <Button
            icon="pi pi-times"
            className="ml-2 p-button-danger"
            onClick={() => setNewTasks(newTasks.filter((_, i) => i !== idx))}
          />
        </div>
      ))}
      <Button label="+ Ajouter une tâche" className="mb-3" onClick={() => setNewTasks([...newTasks, { description: "" }])} />
      <Button label="Enregistrer" onClick={onSave} />
    </div>
  </Dialog>
);

export default AddJourneyDialog;
