import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const AddSupervisorDialog = ({ visible, onHide, supervisorData, setSupervisorData, onSave }) => (
  <Dialog
    header="Ajouter un Superviseur"
    visible={visible}
    style={{ width: "400px" }}
    modal
    onHide={onHide}
  >
    <div className="p-fluid">
      <label>Nom d'utilisateur</label>
      <InputText
        value={supervisorData.username}
        onChange={(e) => setSupervisorData({ ...supervisorData, username: e.target.value })}
      />

      <label className="mt-2">Prénom</label>
      <InputText
        value={supervisorData.firstName}
        onChange={(e) => setSupervisorData({ ...supervisorData, firstName: e.target.value })}
      />

      <label className="mt-2">Nom</label>
      <InputText
        value={supervisorData.lastName}
        onChange={(e) => setSupervisorData({ ...supervisorData, lastName: e.target.value })}
      />

      <label className="mt-2">Téléphone</label>
      <InputText
        value={supervisorData.phoneNo}
        onChange={(e) => setSupervisorData({ ...supervisorData, phoneNo: e.target.value })}
      />

      <label className="mt-2">Mot de passe</label>
      <InputText
        type="password"
        value={supervisorData.password}
        onChange={(e) => setSupervisorData({ ...supervisorData, password: e.target.value })}
      />

      <Button label="Créer le Superviseur" onClick={onSave} className="mt-3" />
    </div>
  </Dialog>
);

export default AddSupervisorDialog;
