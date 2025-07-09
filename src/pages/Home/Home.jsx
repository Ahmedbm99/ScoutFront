import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Common/Navbar";
import JourneyPanel from "../../components/panel/JourneyPanel";
import AuthenticationService from "../../services/AuthenticationService";
import TaskService from "../../services/TaskService";
import ScoutService from "../../services/ScoutService";
import JourneyService from "../../services/JourneyService";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Home = () => {
  const [user, setUser] = useState(null);

  // États modals
  const [showAddJourney, setShowAddJourney] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserList, setShowUserList] = useState(false);

  // Modal édition tâche
  const [showEditTask, setShowEditTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Données pour ajout Journey + tâches
  const [newJourneyTheme, setNewJourneyTheme] = useState("");
  const [newJourneyNumber, setNewJourneyNumber] = useState(1);
  const [newTasks, setNewTasks] = useState([{ description: "" }]);

  // Données ajout utilisateur
  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    progression: 0,
    isAdmin: false,
  });

  // Liste utilisateurs
  const [userList, setUserList] = useState([]);

  const toast = useRef(null);

  useEffect(() => {
    const currentUser = AuthenticationService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Charger liste utilisateurs
  const loadUsers = async () => {
    try {
      const res = await ScoutService.getScoutList();
      
      setUserList(res.data);
    } catch (error) {
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Erreur",
          detail: "Impossible de charger les utilisateurs",
        });
      }
      console.error("Impossible de charger les utilisateurs", error);
    }
  };

  // Ajouter une journée + tâches
  const handleAddJourney = async () => {
    try {
      const journeyPayload = {
        number: newJourneyNumber,
        theme: newJourneyTheme,
        tasksNumber: newTasks.length,
      };
      const journeyRes = await JourneyService.createJourney(journeyPayload);

      const journeyId = journeyRes.data.id;
      for (const task of newTasks) {
        if (task.description.trim() === "") continue;
        await TaskService.addTask({
          number: 1,
          description: task.description,
          isCompleted: false,
          JourneyId: journeyId,
        });
      }

      toast.current.show({
        severity: "success",
        summary: "Succès",
        detail: "Journée et tâches ajoutées.",
      });

      setShowAddJourney(false);
      setNewJourneyTheme("");
      setNewJourneyNumber((prev) => prev + 1);
      setNewTasks([{ description: "" }]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la journée :", error);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible d'ajouter la journée.",
      });
    }
  };

  // Ajouter un utilisateur
  const handleAddUser = async () => {
    try {
      await ScoutService.addScout(newUserData);
      toast.current.show({
        severity: "success",
        summary: "Succès",
        detail: "Utilisateur ajouté.",
      });
      setShowAddUser(false);
      setNewUserData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNo: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur :", error);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible d'ajouter l'utilisateur.",
      });
    }
  };

  // Ouvrir modal modification tâche
  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setShowEditTask(true);
  };

  // Modifier la tâche
  const handleUpdateTask = async () => {
    try {
      if (!taskToEdit) return;
      await TaskService.updateTask(taskToEdit.id, {
        description: taskToEdit.description,
        number: taskToEdit.number,
        JourneyId: taskToEdit.JourneyId,
        isCompleted: taskToEdit.isCompleted,
      });
      toast.current.show({
        severity: "success",
        summary: "Succès",
        detail: "Tâche modifiée.",
      });
      setShowEditTask(false);
      setTaskToEdit(null);
      // Optionnel : recharger la liste des journeys ou mettre à jour localement
    } catch (error) {
      console.error("Erreur lors de la modification de la tâche :", error);
      toast.current.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de modifier la tâche.",
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <Navbar />
      <div className="p-4">
        <h2>Bienvenue, {user?.user?.username}</h2>

        {user?.user?.isAdmin ? (
          <div className="mb-2 bg-blue-100 p-3 rounded">
            <Button
              label="➕ Ajouter une Journée"
              className="mr-2 mb-2"
              onClick={() => setShowAddJourney(true)}
            />
            <Button
              label="👤 Ajouter un Utilisateur"
              className="mr-2 mb-2"
              onClick={() => setShowAddUser(true)}
            />
            <Button
              label="📋 Liste des utilisateurs"
              className="mr-2 mb-2"
              onClick={() => {
                loadUsers();
                setShowUserList(true);
              }}
            />
          </div>
        ) : (
          <p className="mb-4">Profitez de votre camping.</p>
        )}

     
        <JourneyPanel openEditTaskModal={openEditTaskModal} user={user} />
      </div>


      <Dialog
        header="Ajouter une Journée"
        visible={showAddJourney}
        style={{ width: "450px" }}
        modal
        onHide={() => setShowAddJourney(false)}
      >
        <div className="p-fluid">
          <label>Numéro de la journée</label>
          <InputText
            type="number"
            value={newJourneyNumber}
            onChange={(e) => setNewJourneyNumber(parseInt(e.target.value, 10))}
          />
          <label className="mt-3">Thème de la journée</label>
          <InputText
            value={newJourneyTheme}
            onChange={(e) => setNewJourneyTheme(e.target.value)}
          />

          <label className="mt-3">Tâches associées</label>
          {newTasks.map((task, idx) => (
            <div key={idx} className="flex mb-2">
              <InputText
                className="flex-grow-1"
                placeholder={"Description de la tâche"}
                value={task.description}
                onChange={(e) => {
                  const copy = [...newTasks];
                  copy[idx].description = e.target.value;
                  setNewTasks(copy);
                }}
              />
              <Button
                icon="pi pi-times"
                className="ml-2 p-button-danger"
                onClick={() =>
                  setNewTasks(newTasks.filter((_, i) => i !== idx))
                }
              />
            </div>
          ))}
          <Button
            label="+ Ajouter une tâche"
            className="mb-3"
            onClick={() => setNewTasks([...newTasks, { description: "" }])}
          />

          <Button label="Enregistrer" onClick={handleAddJourney} />
        </div>
      </Dialog>

      <Dialog
        header="Ajouter un utilisateur"
        visible={showAddUser}
        style={{ width: "400px" }}
        modal
        onHide={() => setShowAddUser(false)}
      >
        <div className="p-fluid">
          <label>Nom d'utilisateur</label>
          <InputText
            value={newUserData.username}
            onChange={(e) =>
              setNewUserData({ ...newUserData, username: e.target.value })
            }
          />
          <label className="mt-2">Prénom</label>
          <InputText
            value={newUserData.firstName}
            onChange={(e) =>
              setNewUserData({ ...newUserData, firstName: e.target.value })
            }
          />
          <label className="mt-2">Nom</label>
          <InputText
            value={newUserData.lastName}
            onChange={(e) =>
              setNewUserData({ ...newUserData, lastName: e.target.value })
            }
          />
          <label className="mt-2">Téléphone</label>
          <InputText
            value={newUserData.phoneNo}
            onChange={(e) =>
              setNewUserData({ ...newUserData, phoneNo: e.target.value })
            }
          />
          <label className="mt-2">Mot de passe</label>
          <InputText
            type="password"
            value={newUserData.password}
            onChange={(e) =>
              setNewUserData({ ...newUserData, password: e.target.value })
            }
          />

          <Button label="Enregistrer" onClick={handleAddUser} className="mt-3" />
        </div>
      </Dialog>


      {/* Modal Liste des utilisateurs */}
      <Dialog
        header="Liste des utilisateurs"
        visible={showUserList}
        style={{ width: "90vw", maxWidth: "900px" }}
        modal
        onHide={() => setShowUserList(false)}
      >
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
          <Column
            field="progression"
            header="Progression"
            sortable
            body={(rowData) => (rowData.progression ?? 0) + "%"}
          />
        </DataTable>
      </Dialog>

      {/* Modal Modification tâche */}
      <Dialog
        header="Modifier la tâche"
        visible={showEditTask}
        style={{ width: "400px" }}
        modal
        onHide={() => setShowEditTask(false)}
      >
        <div className="p-fluid">
          <label>Description</label>
          <InputText
            value={taskToEdit?.description || ""}
            onChange={(e) =>
              setTaskToEdit({ ...taskToEdit, description: e.target.value })
            }
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
          <Button
            label="Enregistrer"
            className="mt-3"
            onClick={handleUpdateTask}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default Home;
