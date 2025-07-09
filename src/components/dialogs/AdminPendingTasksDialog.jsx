import React, { useMemo, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Rating } from "primereact/rating";
import UserTaskService from "../../services/UserTaskService";
import { Toast } from "primereact/toast";

const AdminPendingTasksDialog = ({
  visible,
  onHide,
  pendingTasks,
  
}) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [ratings, setRatings] = useState({});
  const toast = useRef(null);

  // Initialiser les notes à l'ouverture du détail
 
  // Grouper les tâches par utilisateur
  const groupedUsers = useMemo(() => {
    const map = {};
    for (let task of pendingTasks) {
      const user = task.Leader;
      if (!user) continue;

      if (!map[user.id]) {
        map[user.id] = { id: user.id, username: user.username, tasks: [] };
      }
      map[user.id].tasks.push(task);
    }
    return Object.values(map);
  }, [pendingTasks]);

  // Afficher les tâches d'un utilisateur dans le détail
  const handleViewTasks = (tasks) => {
    setSelectedTasks(tasks);
    setDetailDialogVisible(true);
  };

  // Approuver une tâche avec la note
const handleApprove = async (task,note) => {
  try {

    
    await UserTaskService.approveUserTask(task.id, {
      approved: true,
      note: note,
    });
    toast.current.show({ severity: "success", summary: "Approuvé" });
  
    setDetailDialogVisible(false);
  } catch (err) {
    console.error("Erreur lors de l'approbation de la tâche :", err);
    toast.current.show({ severity: "error", summary: "Erreur" });
  }
};

  // Rejeter une tâche
  const handleReject = async (task) => {
    try {
      await UserTaskService.approveUserTask(task.id, {
        approved: false,
        note: 0,
      });
      toast.current.show({ severity: "warn", summary: "Rejeté" });

      setDetailDialogVisible(false);
    } catch (err) {
      toast.current.show({ severity: "error", summary: "Erreur" });
    }
  };

  return (
    <>
      <Toast ref={toast} />

      {/* Dialog des utilisateurs avec tâches en attente */}
      <Dialog
        header="Tâches en attente des utilisateurs"
        visible={visible}
        style={{ width: "50vw" }}
        modal
        onHide={onHide}
      >
        <DataTable value={groupedUsers} responsiveLayout="scroll">
          <Column field="username" header="Utilisateur" />
          <Column
            header="Tâches en attente"
            body={(rowData) => rowData.tasks.length}
          />
          <Column
            header="Action"
            body={(rowData) => (
              <Button
                label="Voir"
                icon="pi pi-eye"
                className="p-button-info p-button-sm"
                onClick={() => handleViewTasks(rowData.tasks)}
              />
            )}
          />
        </DataTable>
      </Dialog>

      {/* Dialog détail des tâches pour un utilisateur */}
      <Dialog
        header="Détails des tâches"
        visible={detailDialogVisible}
        style={{ width: "90vw" }}
        modal
        onHide={() => setDetailDialogVisible(false)}
      >
        <DataTable value={selectedTasks} responsiveLayout="scroll">
          <Column
            field="Task.description"
            header="Tâche"
            body={(rowData) => rowData.Task.description}
          />
          <Column
            field="justificationComment"
            header="Commentaire"
            body={(rowData) => (
              <InputTextarea value={rowData.justificationComment} disabled />
            )}
          />
          <Column
            header="Média"
            body={(rowData) =>
              rowData.justificationMedia ? (
                <img
                  src={`http://localhost:5000/uploads/${rowData.justificationMedia}`}
                  alt="Justification"
                  style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
                />
              ) : (
                "Aucun"
              )
            }
          />
<Column
  header="Note"
  body={(rowData) => {
    const ratingValue = ratings[rowData.id] ?? 0;
    return (
    <Rating
        value={ratingValue}
        onChange={(e) => {
          setRatings(prev => ({ ...prev, [rowData.id]: e.value }));
          console.log(`Note pour tâche ${rowData.id} :`, e.value);
        }}
        cancel={false}
      />
    );
  }}
/>
          <Column
            header="Action"
            body={(rowData) => (
              <>
                <Button
                  label="Approuver"
                  className="p-button-success p-button-sm mr-2"
                  onClick={() =>
                    handleApprove(rowData, ratings[rowData.id] )
                  }
                
                />
                <Button
                  label="Rejeter"
                  className="p-button-danger p-button-sm"
                  onClick={() => handleReject(rowData)}
                />
              </>
            )}
          />
        </DataTable>
      </Dialog>
    </>
  );
};

export default AdminPendingTasksDialog;
