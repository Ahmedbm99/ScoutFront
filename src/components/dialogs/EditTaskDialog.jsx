import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const EditTaskDialog = ({ visible, onHide, taskToEdit, setTaskToEdit, onSave }) => (
  <Dialog header="Modifier la tâche" visible={visible} style={{ width: "400px" }} modal onHide={onHide}>
    <div className="p-fluid">
      <label>Description</label>
      <InputText
        value={taskToEdit?.description || ""}
        onChange={(e) => setTaskToEdit({ ...taskToEdit, description: e.target.value })}
      />
      <label className="mt-2">Numéro</label>
      <InputText
        type="number"
        value={taskToEdit?.number || 1}
        onChange={(e) =>
          setTaskToEdit({
            ...taskToEdit,
            number: parseInt(e.target.value, 10) || 1,
          })
        }
      />
      <Button label="Enregistrer" className="mt-3" onClick={onSave} />
    </div>
  </Dialog>
);

export default EditTaskDialog;
