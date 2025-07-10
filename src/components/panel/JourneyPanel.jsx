import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";

import JourneyService from "../../services/JourneyService";
import UserTaskService from "../../services/UserTaskService";
import TaskService from "../../services/TaskService";
import ScoutService from "../../services/ScoutService";

import JustificationDialog from "../dialogs/JustificationDialog";
import AuthenticationService from "../../services/AuthenticationService";

export default function JourneyPanel() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
   const [ setUsers] = useState([]);
 

const [userTasksDone, setUserTasksDone] = useState([]);
  // États pour dialogue justification
  const [justifyDialogVisible, setJustifyDialogVisible] = useState(false);
  const [currentJustifyTask, setCurrentJustifyTask] = useState(null);

  // États pour modification/ajout journées
  const [newJourneyTheme, setNewJourneyTheme] = useState("");
  const [newJourneyNumber, setNewJourneyNumber] = useState(1);
  const [editingJourneyId, setEditingJourneyId] = useState(null);
  const [editingJourneyTheme, setEditingJourneyTheme] = useState("");
  const [editingJourneyNumber, setEditingJourneyNumber] = useState(1);

  // États pour modification/ajout tâches
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskDescription, setEditingTaskDescription] = useState("");

  const toast = useRef(null);

useEffect(() => {
  const currentUser = AuthenticationService.getCurrentUser();
  setUser(currentUser);
  fetchUserTasksDone(currentUser);
}, []);

useEffect(() => {
  if (user) {
    
    fetchData();
  }
}, [user]);


  const fetchData = async () => {
    setLoading(true);
    try {
      const journeyRes = await JourneyService.getJourneyList();
      const journeysData = Array.isArray(journeyRes.data)
        ? journeyRes.data
        : journeyRes.data.journeys;

      const taskRes = await TaskService.getTaskList();
      const tasksData = Array.isArray(taskRes.data)
        ? taskRes.data
        : taskRes.data.tasks;

      const journeysMap = {};
      journeysData.forEach((journey) => {
        journeysMap[journey.id] = { ...journey, tasks: [] };
      });

      tasksData.forEach((task) => {
        if (journeysMap[task.JourneyId]) {
          journeysMap[task.JourneyId].tasks.push(task);
        }
      });

     const today = new Date();
today.setHours(0, 0, 0, 0); // ignore l'heure exacte

let resultJourneys = Object.values(journeysMap);
      
if (!user.isAdmin) {
  
  resultJourneys = resultJourneys.filter((journey) => {
    const journeyDate = new Date(journey.date || journey.createdAt); // adapte à ton modèle
    journeyDate.setHours(0, 0, 0, 0);
  console.log("Filtrage des journées pour l'utilisateur simple",journeyDate, today);
    return journeyDate <= today;
  });
}

// 🔁 Tri par numéro de journée
resultJourneys.sort((a, b) => a.number - b.number);

setJourneys(resultJourneys);


      const allUsersResponse = await ScoutService.getScoutList();
      if (Array.isArray(allUsersResponse.data)) {
        setUsers(allUsersResponse.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Chargement échoué.",
      });
    } finally {
      setLoading(false);
    }
  };
const fetchUserTasksDone = async (user) => {
  if (!user) return;
  try {
    const res = await UserTaskService.getUserDoneTasks(user.id);
    console.log("User tasks done response:", res);
    setUserTasksDone(res.map(ut => ut.Task.id));

  } catch (error) {
    console.error("Erreur chargement UserTasks :", error);
  }
};
  // Ouvre dialogue justification (utilisateur simple)
  const openJustificationDialog = (journeyId, taskIndex, task) => {
    setCurrentJustifyTask({ journeyId, taskIndex, task });
    setJustifyDialogVisible(true);
  };

  // Soumettre justification au backend via UserTaskService
  const submitJustification = async (comment, media) => {
    if (!currentJustifyTask) return;

    try {
      const formData = new FormData();
      formData.append("LeaderId", user.id);
      formData.append("TaskId", currentJustifyTask.task.id);
      formData.append("justificationComment", comment);
      if (media) formData.append("media", media);

      await UserTaskService.submitUserTaskJustification(formData);

      setJourneys((oldJourneys) =>
        oldJourneys.map((j) => {
          if (j.id === currentJustifyTask.journeyId) {
            const updatedTasks = j.tasks.map((t, idx) =>
              idx === currentJustifyTask.taskIndex ? { ...t, isCompleted: true } : t
            );
            return { ...j, tasks: updatedTasks };
          }
          return j;
        })
      );

      toast.current?.show({
        severity: "success",
        summary: "Justification envoyée",
        detail: "Votre tâche a été soumise pour validation.",
      });

      setJustifyDialogVisible(false);
    } catch (error) {
      console.error("Erreur soumission justification:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de l'envoi de la justification.",
      });
    }
  };

  // Gestion du clic sur checkbox tâche
  const onTaskCheckboxChange = (journeyId, taskIndex, task) => {
    if (user.isAdmin) {
      // Admin ne coche pas ici (à adapter si besoin)
    } else {
      openJustificationDialog(journeyId, taskIndex, task);
    }
  };

  // ---- GESTION ADMIN : AJOUT JOURNÉE ----
  const handleAddJourney = async () => {
    if (!newJourneyTheme || !newJourneyNumber) {
      toast.current?.show({ severity: "warn", summary: "Remplissez tous les champs" });
      return;
    }
    try {
      await JourneyService.createJourney({
        theme: newJourneyTheme,
        number: newJourneyNumber,
      });
      toast.current?.show({ severity: "success", summary: "Journée ajoutée" });
      setNewJourneyTheme("");
      setNewJourneyNumber(newJourneyNumber + 1);
      fetchData();
    } catch (err) {
      toast.current?.show({ severity: "error", summary: "Erreur lors de l'ajout" });
    }
  };

  // ---- GESTION ADMIN : SUPPRIMER JOURNÉE ----
  const confirmDeleteJourney = (journeyId) => {
    confirmDialog({
      message: "Voulez-vous vraiment supprimer cette journée et toutes ses tâches ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await JourneyService.deleteJourney(journeyId);
          toast.current?.show({ severity: "success", summary: "Journée supprimée" });
          fetchData();
        } catch (err) {
          toast.current?.show({ severity: "error", summary: "Erreur suppression" });
        }
      },
    });
  };

  // ---- GESTION ADMIN : MODIFIER JOURNÉE ----
  const startEditJourney = (journey) => {
    setEditingJourneyId(journey.id);
    setEditingJourneyTheme(journey.theme);
    setEditingJourneyNumber(journey.number);
  };
  const cancelEditJourney = () => {
    setEditingJourneyId(null);
  };
  const saveEditJourney = async () => {
    if (!editingJourneyTheme || !editingJourneyNumber) {
      toast.current?.show({ severity: "warn", summary: "Remplissez tous les champs" });
      return;
    }
    try {
      await JourneyService.updateJourney(editingJourneyId, {
        theme: editingJourneyTheme,
        number: editingJourneyNumber,
      });
      toast.current?.show({ severity: "success", summary: "Journée modifiée" });
      setEditingJourneyId(null);
      fetchData();
    } catch (err) {
      toast.current?.show({ severity: "error", summary: "Erreur modification" });
    }
  };

  // ---- GESTION ADMIN : AJOUT TÂCHE ----
  const handleAddTask = async (journeyId) => {
    if (!newTaskDescription) {
      toast.current?.show({ severity: "warn", summary: "Description requise" });
      return;
    }
    try {
      await TaskService.addTask({
        description: newTaskDescription,
        number: 1,
        isCompleted: false,
        JourneyId: journeyId,
      });
      toast.current?.show({ severity: "success", summary: "Tâche ajoutée" });
      setNewTaskDescription("");
      fetchData();
    } catch (err) {
      toast.current?.show({ severity: "error", summary: "Erreur ajout tâche" });
    }
  };

  // ---- GESTION ADMIN : SUPPRIMER TÂCHE ----
  const confirmDeleteTask = (taskId) => {
    confirmDialog({
      message: "Voulez-vous vraiment supprimer cette tâche ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await TaskService.deleteTask(taskId);
          toast.current?.show({ severity: "success", summary: "Tâche supprimée" });
          fetchData();
        } catch (err) {
          toast.current?.show({ severity: "error", summary: "Erreur suppression tâche" });
        }
      },
    });
  };

  // ---- GESTION ADMIN : MODIFIER TÂCHE ----
  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskDescription(task.description);
  };
  const cancelEditTask = () => {
    setEditingTaskId(null);
  };
  const saveEditTask = async () => {
    if (!editingTaskDescription) {
      toast.current?.show({ severity: "warn", summary: "Description requise" });
      return;
    }
    try {
      await TaskService.updateTask(editingTaskId, {
        description: editingTaskDescription,
      });
      toast.current?.show({ severity: "success", summary: "Tâche modifiée" });
      setEditingTaskId(null);
      fetchData();
    } catch (err) {
      toast.current?.show({ severity: "error", summary: "Erreur modification tâche" });
    }
  };

  if (loading) return <p>Chargement des parcours...</p>;

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />

      {journeys.map((journey) => (
        <Panel
          key={journey.id}
          header={
            editingJourneyId === journey.id ? (
              <>
                <InputText
                  value={editingJourneyTheme}
                  onChange={(e) => setEditingJourneyTheme(e.target.value)}
                  className="mr-2"
                />
                <InputText
                  type="number"
                  value={editingJourneyNumber}
                  onChange={(e) => setEditingJourneyNumber(Number(e.target.value))}
                  className="mr-2"
                  style={{ width: "80px" }}
                />
                <Button icon="pi pi-check" className="p-button-success mr-2" onClick={saveEditJourney} />
                <Button icon="pi pi-times" className="p-button-secondary" onClick={cancelEditJourney} />
              </>
            ) : (
              <>
                🚍 {journey.theme} - Jour #{journey.number}
                {user.isAdmin && (
                  <>
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-rounded p-button-text ml-3"
                      onClick={() => startEditJourney(journey)}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-rounded p-button-text p-button-danger ml-2"
                      onClick={() => confirmDeleteJourney(journey.id)}
                    />
                  </>
                )}
              </>
            )
          }
          toggleable
          className="mb-3"
        >
          <ul className="list-none p-0 m-0">
            {journey.tasks.map((task, index) => (
              <li key={task.id ?? index} className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    inputId={`task-${journey.id}-${index}`}
                    checked={userTasksDone.includes(task.id)}
                    onChange={() => onTaskCheckboxChange(journey.id, index, task)}
                    disabled={userTasksDone.includes(task.id) || user.isAdmin}
                  />
                  {editingTaskId === task.id ? (
                    <>
                      <InputText
                        value={editingTaskDescription}
                        onChange={(e) => setEditingTaskDescription(e.target.value)}
                        className="ml-2"
                      />
                      <Button label="Save" icon="pi pi-check" onClick={saveEditTask} className="ml-2 p-button-sm" />
                      <Button label="Cancel" icon="pi pi-times" onClick={cancelEditTask} className="ml-2 p-button-sm p-button-secondary" />
                    </>
                  ) : (
                    <label htmlFor={`task-${journey.id}-${index}`} className="ml-2">
                      {task.description}
                    </label>
                  )}
                </div>
                {user.isAdmin && editingTaskId !== task.id && (
                  <div className="flex space-x-2">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => startEditTask(task)} />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-danger" onClick={() => confirmDeleteTask(task.id)} />
                  </div>
                )}
              </li>
            ))}
            {user.isAdmin && (
              <li className="mt-2 flex items-center">
                <InputText
                  placeholder="Nouvelle tâche"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="p-1 border mr-2"
                />
                <Button label="Ajouter tâche" onClick={() => handleAddTask(journey.id)} className="p-button-sm" />
              </li>
            )}
          </ul>
        </Panel>
      ))}

      {/* Dialog justification */}
      <JustificationDialog
        visible={justifyDialogVisible}
        onHide={() => setJustifyDialogVisible(false)}
        task={currentJustifyTask?.task}
        onSubmit={submitJustification}
      />
    </>
  );
}
