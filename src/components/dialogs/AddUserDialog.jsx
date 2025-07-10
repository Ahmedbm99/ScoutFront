import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const AddUserDialog = ({ visible, onHide, newUserData, setNewUserData, onSave, supervisors }) => (

  <Dialog header="Ajouter un utilisateur" visible={visible} style={{ width: "400px" }} modal onHide={onHide}>
    <div className="p-fluid">
      <label>Nom d'utilisateur</label>
      <InputText
        value={newUserData.username}
        onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
      />

      <label className="mt-2">Prénom</label>
      <InputText
        value={newUserData.firstName}
        onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
      />

      <label className="mt-2">Nom</label>
      <InputText
        value={newUserData.lastName}
        onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
      />

      <label className="mt-2">Téléphone</label>
      <InputText
        value={newUserData.phoneNo}
        onChange={(e) => setNewUserData({ ...newUserData, phoneNo: e.target.value })}
      />

      <label className="mt-2">Mot de passe</label>
      <InputText
        type="password"
        value={newUserData.password}
        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
      />

      <label className="mt-2">Superviseur</label>
      <Dropdown
        value={newUserData.supervisorId}
        options={supervisors}
        onChange={(e) => setNewUserData({ ...newUserData, supervisorId: e.value })}
        optionLabel="username" // ou autre propriété à afficher, par exemple 'firstName'
        placeholder="Sélectionner un superviseur"
        filter
        filterBy="username,firstName,lastName"
      />

      <Button label="Enregistrer" onClick={onSave} className="mt-3" />
    </div>
  </Dialog>
);

export default AddUserDialog;
