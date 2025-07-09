import React from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const UserListDialog = ({ visible, onHide, userList }) => (
  <Dialog header="Liste des utilisateurs" visible={visible} style={{ width: "90vw", maxWidth: "900px" }} modal onHide={onHide}>
    <DataTable
      value={userList}
      paginator
      rows={10}
      emptyMessage="Aucun utilisateur trouvé."
      responsiveLayout="scroll"
    >
      <Column field="username" header="Nom d'utilisateur" sortable />
      <Column field="firstName" header="Prénom" sortable />
      <Column field="lastName" header="Nom" sortable />
      <Column field="progression" header="Progression" sortable body={(rowData) => (rowData.progression ?? 0) + "%"} />
    </DataTable>
  </Dialog>
);

export default UserListDialog;
