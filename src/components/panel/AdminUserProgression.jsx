import React, { useEffect, useState } from "react";
import UserTaskService from "../../services/UserTaskService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";

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
        const res = await UserTaskService.getUsersProgressions(selectedUserIds);
        setProgressions(res.data);
      } catch (error) {
        console.error("Erreur récupération progressions :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressions();
  }, [selectedUserIds]);

  const noteSeverity = (note) => {
    if (note >= 4) return "success";
    if (note >= 2) return "warning";
    return "danger";
  };

  const renderTasksWithNotes = (row) => {
    if (!row.completedTasks || row.completedTasks.length === 0) {
      return <i style={{ color: "#777" }}>Aucune tâche accomplie</i>;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          padding: "4px 0",
        }}
      >
        {row.completedTasks.map((task, index) => (
          <div
            key={index}
            style={{
              background: "#f9f9f9",
              borderRadius: 10,
              padding: "8px 12px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <strong style={{ flex: 1 }}>{task.description}</strong>
              <Tag
                value={task.note ?? "N/A"}
                severity={noteSeverity(task.note)}
                rounded
                style={{ minWidth: 35, textAlign: "center" }}
              />
            </div>
            <div style={{ fontStyle: "italic", color: "#666", fontSize: "0.85rem" }}>
              Justification : {task.justificationComment || "Aucune"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const progressionBodyTemplate = (row) => (
    <Tag
      value={`${row.progression}%`}
      severity={
        row.progression >= 75
          ? "success"
          : row.progression >= 40
          ? "warning"
          : "danger"
      }
      rounded
      style={{ minWidth: 45, textAlign: "center", fontWeight: "600" }}
    />
  );

  const supervisorBodyTemplate = (row) => {
    const supervisor = users.find((u) => u.id === row.supervisorId);
    return supervisor ? supervisor.username : "Non défini";
  };

  return (
    <Card className="p-mt-4" style={{ maxWidth: "1000px", margin: "auto" }}>
      <h3 style={{ textAlign: "center", color: "#444", marginBottom: "1rem" }}>
        Suivi des progressions utilisateurs
      </h3>

      <MultiSelect
        value={selectedUserIds}
        options={users.map((u) => ({ label: u.username, value: u.id }))}
        onChange={(e) => setSelectedUserIds(e.value)}
        placeholder="Sélectionner utilisateurs"
        display="chip"
        filter
        showClear
        className="p-mb-4"
        style={{ minWidth: 300, maxWidth: "100%" }}
      />

      <div style={{ overflowX: "auto", width: "100%" }}>
        <DataTable
          value={progressions}
          loading={loading}
          responsiveLayout="stack"
          emptyMessage="Aucun utilisateur sélectionné"
          resizableColumns
          columnResizeMode="expand"
          stripedRows
          scrollable
          style={{ minWidth: "100%", borderCollapse: "collapse" }}
        >
          <Column
            field="username"
            header="Utilisateur"
            sortable
            style={{ minWidth: "160px", fontWeight: "600" }}
          />
          <Column
            header="Superviseur"
            body={supervisorBodyTemplate}
            style={{ minWidth: "150px" }}
          />
          <Column
            header="Progression"
            body={progressionBodyTemplate}
            sortable
            style={{ minWidth: "130px" }}
          />
          <Column
            header="Tâches accomplies"
            body={renderTasksWithNotes}
            style={{ minWidth: "400px" }}
          />
        </DataTable>
      </div>
    </Card>
  );
}
