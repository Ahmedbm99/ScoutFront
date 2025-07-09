import React, { useEffect, useState } from "react";
import UserTaskService from "../../services/UserTaskService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";

export default function AdminUserProgression({ users }) {
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [progressions, setProgressions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUserIds.length === 0) {
      setProgressions([]);
      return;
    }

    const fetchProgressions = async () => {
      setLoading(true);
      try {
        const data = await UserTaskService.getUsersProgressions(selectedUserIds);
        setProgressions(data);
      } catch (error) {
        console.error("Erreur récupération progressions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressions();
  }, [selectedUserIds]);

  return (
    <div>
      <h3>Suivi des progressions utilisateurs</h3>

      <MultiSelect
        value={selectedUserIds}
        options={users.map(u => ({ label: u.username, value: u.id }))}
        onChange={(e) => setSelectedUserIds(e.value)}
        placeholder="Sélectionner utilisateurs"
        display="chip"
        style={{ width: "300px", marginBottom: "1rem" }}
      />

      <DataTable
        value={progressions}
        loading={loading}
        responsiveLayout="scroll"
        emptyMessage="Aucun utilisateur sélectionné"
      >
        <Column field="username" header="Utilisateur" />
        <Column
          header="Progression"
          body={(row) => `${row.progression}%`}
          style={{ width: "130px" }}
        />
        <Column
          header="Tâches accomplies"
          body={(row) =>
            row.completedTasks.length > 0
              ? (
                <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                  {row.completedTasks.map(task => (
                    <li key={task.id}>{task.description}</li>
                  ))}
                </ul>
              )
              : "Aucune"
          }
        />
      </DataTable>
    </div>
  );
}
