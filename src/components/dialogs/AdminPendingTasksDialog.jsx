import React, { useEffect, useMemo, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import UserTaskService from "../../services/UserTaskService";
import { Toast } from "primereact/toast";

const AdminPendingTasksDialog = ({ visible, onHide, pendingTasks,  onTaskUpdated }) => {
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [ratings, setRatings] = useState({});
  const toast = useRef(null);

  // Grouper tâches par utilisateur
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

  // Initialise ratings **une seule fois** lors du changement de selectedTasks
  useEffect(() => {
    setRatings((prevRatings) => {
      const newRatings = { ...prevRatings };
      selectedTasks.forEach((task) => {
        if (!(task.id in newRatings)) {
          newRatings[task.id] = 0; // valeur par défaut uniquement si pas déjà défini
        }
      });
      return newRatings;
    });
  }, [selectedTasks]);

  // Ouvrir dialogue détail
  const handleViewTasks = (tasks) => {
    setSelectedTasks(tasks);
    setDetailDialogVisible(true);
  };

 const handleApprove = async (task, note) => {
    try {
      await UserTaskService.approveUserTask(task.id, {
        approved: true,
        note,
      });
      toast.current.show({ severity: "success", summary: "Approuvé" });
      if (onTaskUpdated) onTaskUpdated();  // mise à jour après validation
      setDetailDialogVisible(false);
    } catch (err) {
      console.error("Erreur lors de l'approbation de la tâche :", err);
      toast.current.show({ severity: "error", summary: "Erreur" });
    }
  };

  const handleReject = async (task) => {
    try {
      await UserTaskService.approveUserTask(task.id, {
        approved: false,
        note: 0,
      });
      toast.current.show({ severity: "warn", summary: "Rejeté" });
      if (onTaskUpdated) onTaskUpdated();  // mise à jour après rejet
      setDetailDialogVisible(false);
    } catch (err) {
      toast.current.show({ severity: "error", summary: "Erreur" });
    }
  };

  return (
    <>
      <Toast ref={toast} />

      {/* Dialog des utilisateurs */}
      <Dialog
        header="Tâches en attente des utilisateurs"
        visible={visible}
        style={{ width: "50vw" }}
        modal
        onHide={onHide}
      >
        <DataTable value={groupedUsers} responsiveLayout="scroll">
          <Column field="username" header="Utilisateur" />
          <Column header="Tâches en attente" body={(rowData) => rowData.tasks.length} />
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

      {/* Dialog détail des tâches */}
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
            body={(rowData) => <InputTextarea value={rowData.justificationComment} disabled />}
          />
          <Column
            header="Média"
            body={(rowData) =>
              rowData.justificationMedia ? (
                <img
                  src={`https://scoutback.onrender.com/uploads/${rowData.justificationMedia}`}
                  alt="Justification"
                  style={{ width: "100%", maxWidth: "120px", borderRadius: "8px" }}
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
                <Dropdown
                  value={ratingValue || 0}
                  options={[0, 1, 2].map((v) => ({ label: v.toString(), value: v }))}
                  onChange={(e) => {
                    setRatings((prev) => ({ ...prev, [rowData.id]: e.value }));
                    console.log(`Note pour tâche ${rowData.id} :`, e.value);
                  }}
                  placeholder="Choisir"
                  style={{ width: "100px" }}
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
                  onClick={() => handleApprove(rowData, ratings[rowData.id])}
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
