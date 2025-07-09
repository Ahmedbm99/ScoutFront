import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import JourneyService from "../../services/JourneyService";
import UserTaskService from "../../services/UserTaskService";

export default function UserTasksPage({ user }) {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [justifyDialogVisible, setJustifyDialogVisible] = useState(false);
  const [currentJustifyTask, setCurrentJustifyTask] = useState(null);
  const [justificationComment, setJustificationComment] = useState("");
  const [justificationMedia, setJustificationMedia] = useState(null);

  const toast = useRef(null);

  useEffect(() => {
    const fetchJourneysAndTasks = async () => {
      setLoading(true);
      try {
        // Récupérer les journeys avec leurs tâches
        const res = await JourneyService.getJourneyList();
        let journeysData = Array.isArray(res.data) ? res.data : res.data.journeys;

        for (const journey of journeysData) {
          const tasksRes = await JourneyService.getTasksForJourney(journey.id); // adapter service !
          journey.tasks = tasksRes.data || [];
        }

        setJourneys(journeysData);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: "Échec du chargement des parcours.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJourneysAndTasks();
  }, []);

  // Ouvrir le dialog justification pour une tâche donnée
  const openJustifyDialog = (task) => {
    setCurrentJustifyTask(task);
    setJustificationComment("");
    setJustificationMedia(null);
    setJustifyDialogVisible(true);
  };

  const submitJustification = async () => {
    if (!currentJustifyTask) return;

    if (!justificationComment.trim() && !justificationMedia) {
      toast.current?.show({
        severity: "warn",
        summary: "Attention",
        detail: "Merci d'ajouter un commentaire ou un média.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("UserId", user.user.id);
      formData.append("TaskId", currentJustifyTask.id);
      formData.append("justificationComment", justificationComment);
      if (justificationMedia) formData.append("justificationMedia", justificationMedia);

      await UserTaskService.submitUserTask(formData);

      toast.current?.show({
        severity: "success",
        summary: "Justification envoyée",
        detail: "Votre tâche a été soumise pour validation.",
      });

      setJustifyDialogVisible(false);

      // Optionnel : mettre à jour localement la tâche
      setJourneys((oldJourneys) =>
        oldJourneys.map((j) => ({
          ...j,
          tasks: j.tasks.map((t) =>
            t.id === currentJustifyTask.id ? { ...t, isCompleted: true } : t
          ),
        }))
      );
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de l'envoi de la justification.",
      });
    }
  };

  if (loading) return <p>Chargement des tâches...</p>;

  return (
    <>
      <Toast ref={toast} />

      <h2>Vos tâches du jour</h2>

      {journeys.length === 0 && <p>Aucun parcours trouvé.</p>}

      {journeys.map((journey) => (
        <Panel
          key={journey.id}
          header={`🚍 ${journey.theme} - Jour #${journey.number}`}
          toggleable
          className="mb-3"
        >
          {(!journey.tasks || journey.tasks.length === 0) && (
            <p>Aucune tâche dans cette journée.</p>
          )}

          <ul>
            {journey.tasks
              .filter((task) => !task.isCompleted) // Montre uniquement tâches non accomplies
              .map((task) => (
                <li key={task.id} className="mb-2 flex items-center justify-between">
                  <span>{task.description}</span>
                  <Button label="Justifier" onClick={() => openJustifyDialog(task)} />
                </li>
              ))}
          </ul>
        </Panel>
      ))}

      {/* Dialog justification */}
      <Dialog
        header="Justification de tâche"
        visible={justifyDialogVisible}
        modal
        onHide={() => setJustifyDialogVisible(false)}
        style={{ width: "400px" }}
        footer={
          <>
            <Button
              label="Annuler"
              icon="pi pi-times"
              onClick={() => setJustifyDialogVisible(false)}
              className="p-button-text"
            />
            <Button label="Envoyer" icon="pi pi-check" onClick={submitJustification} />
          </>
        }
      >
        <div className="p-fluid">
          <label>Commentaire</label>
          <InputTextarea
            rows={4}
            value={justificationComment}
            onChange={(e) => setJustificationComment(e.target.value)}
            autoFocus
          />
          <div className="mt-3">
            <label>Joindre un média (image/vidéo)</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setJustificationMedia(e.target.files[0])}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
