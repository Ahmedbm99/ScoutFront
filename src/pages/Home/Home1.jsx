import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Common/Navbar";
import JourneyPanel from "../../components/panel/JourneyPanel";
import AuthenticationService from "../../services/AuthenticationService";
import TaskService from "../../services/TaskService";
import ScoutService from "../../services/ScoutService";
import JourneyService from "../../services/JourneyService";
import UserTaskService from "../../services/UserTaskService";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

// Dialog components
import AddUserDialog from "../../components/dialogs/AddUserDialog";
import AddSupervisorDialog from "../../components/dialogs/AddSupervisorDialog";
import AddJourneyDialog from "../../components/dialogs/AddJourneyDialog";
import UserListDialog from "../../components/dialogs/UserListDialog";
import EditTaskDialog from "../../components/dialogs/EditTaskDialog";
import AdminPendingTasksDialog from "../../components/dialogs/AdminPendingTasksDialog";
import JustificationDialog from "../../components/dialogs/JustificationDialog";
import AdminUserProgression from "../../components/panel/AdminUserProgression";

const Home = () => {
  const [user, setUser] = useState(null);
  const toast = useRef(null);
  const [supervisors, setSupervisors] = useState([]);
  const [showAddJourney, setShowAddJourney] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showJustificationDialog, setShowJustificationDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
const [newJourneyDate, setNewJourneyDate] = useState("");
  const [newJourneyTheme, setNewJourneyTheme] = useState("");
  const [newJourneyNumber, setNewJourneyNumber] = useState(1);
  const [newTasks, setNewTasks] = useState([{ description: "" }]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [showUserTaskDialog, setShowUserTaskDialog] = useState(false);
  const [showAllPendingDialog, setShowAllPendingDialog] = useState(false);
const [showAddSupervisor, setShowAddSupervisor] = useState(false);
const [supervisorData, setSupervisorData] = useState({
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNo: "",
  progression: 0,
  isAdmin: true // pour distinguer en tant que superviseur
});

  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    progression: 0,
    isAdmin: false,
  });

  const [userList, setUserList] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const currentUser = AuthenticationService.getCurrentUser();
    setUser(currentUser);
   if (currentUser.user.isAdmin) {
    UserTaskService.getPendingUserTasks().then(setPendingTasks);
       loadUsers(); 
  }
  }, []);

  const loadUsers = async () => {
    try {
      const res = await ScoutService.getScoutList();
      setUserList(res.data);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger les utilisateurs",
      });
    }
  };
  const handleAddSupervisor = async () => {
  try {
    // 1. Création sans supervisorId
    const res = await ScoutService.addSupervisor({
      ...supervisorData,
      supervisorId: null
    });

    const created = res.data;

    // 2. Mise à jour du supervisorId avec son propre ID
    await ScoutService.updateScout(created.id, {
      supervisorId: created.id
    });

    toast.current?.show({
      severity: "success",
      summary: "Succès",
      detail: "Superviseur ajouté avec succès.",
    });

    setShowAddSupervisor(false);
    setSupervisorData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNo: "",
      progression: 0,
      isAdmin: true
    });

    loadUsers();
    loadSupervisors();
  } catch (error) {
    toast.current?.show({
      severity: "error",
      summary: "Erreur",
      detail: "Impossible d’ajouter le superviseur.",
    });
  }
};

  const handleAddJourney = async () => {
    try {
      const journeyPayload = {
        number: newJourneyNumber,
        theme: newJourneyTheme,
        tasksNumber: newTasks.length,
        date: newJourneyDate,
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

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Journée et tâches ajoutées.",
      });

      setShowAddJourney(false);
      setNewJourneyTheme("");
      setNewJourneyNumber((prev) => prev + 1);
      setNewTasks([{ description: "" }]);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible d'ajouter la journée.",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      await ScoutService.addScout(newUserData);
      toast.current?.show({
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
        progression: 0,
        isAdmin: false,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible d'ajouter l'utilisateur.",
      });
    }
  };
  const loadSupervisors = async () => {
    try {
      const res = await ScoutService.getSuperviserList();
      // Si tu souhaites filtrer les superviseurs (par exemple, uniquement ceux avec isAdmin = true)
      const filteredSupervisors = res.data.filter(user => user.isAdmin === true);
      setSupervisors(filteredSupervisors);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger les superviseurs",
      });
    }
  };
  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setShowEditTask(true);
  };

  const openJustificationDialog = (task) => {
    setSelectedTask(task);
    setShowJustificationDialog(true);
  };

  const handleUpdateTask = async () => {
    if (!taskToEdit) return;
    try {
      await TaskService.updateTask(taskToEdit.id, {
        description: taskToEdit.description,
        number: taskToEdit.number,
        JourneyId: taskToEdit.JourneyId,
        isCompleted: taskToEdit.isCompleted,
      });

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Tâche modifiée.",
      });

      setShowEditTask(false);
      setTaskToEdit(null);
    } catch (error) {
      toast.current?.show({
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
            <Button label="➕ Ajouter une Journée" className="mr-2 mb-2" onClick={() => setShowAddJourney(true)} />
            <Button label="👤 Ajouter un Superviseur" className="mr-2 mb-2" onClick={() => setShowAddSupervisor(true)}/>  
            <Button label="👤 Ajouter un Utilisateur" className="mr-2 mb-2" onClick={() => {loadSupervisors(); setShowAddUser(true);}}/>
            <Button label="📋 Liste des utilisateurs" className="mr-2 mb-2" onClick={() => { loadUsers(); setShowUserList(true); }} />
            <Button label="📨 Tâches à approuver" className="mr-2 mb-2" onClick={() => setShowAllPendingDialog(true)} />
            <AdminUserProgression users={userList} />
          </div>
        ) : (
          <p className="mb-4">Profitez de votre camping.</p>
        )}

        <JourneyPanel
          openEditTaskModal={openEditTaskModal}
          openJustificationDialog={openJustificationDialog}
        user={user}
        />
  

      </div>
      <AddSupervisorDialog
  visible={showAddSupervisor}
  onHide={() => setShowAddSupervisor(false)}
  supervisorData={supervisorData}
  setSupervisorData={setSupervisorData}
  onSave={handleAddSupervisor}
/>  
      <AddUserDialog visible={showAddUser} onHide={() => setShowAddUser(false)} supervisors={supervisors} newUserData={newUserData} setNewUserData={setNewUserData} onSave={handleAddUser} />
      <AddJourneyDialog visible={showAddJourney} onHide={() => setShowAddJourney(false)} newJourneyNumber={newJourneyNumber} setNewJourneyNumber={setNewJourneyNumber} newJourneyTheme={newJourneyTheme} setNewJourneyTheme={setNewJourneyTheme} newJourneyDate={newJourneyDate} setNewJourneyDate={setNewJourneyDate} newTasks={newTasks} setNewTasks={setNewTasks} onSave={handleAddJourney}/>     
      <UserListDialog visible={showUserList} onHide={() => setShowUserList(false)} userList={userList} />
      <EditTaskDialog visible={showEditTask} onHide={() => setShowEditTask(false)} taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} onSave={handleUpdateTask} />
      <AdminPendingTasksDialog visible={showAllPendingDialog} onHide={() => setShowAllPendingDialog(false)}  pendingTasks={pendingTasks} onSelectUserTasks={(tasks) => { setSelectedUserTasks(tasks); setShowUserTaskDialog(true); }} />
      <JustificationDialog visible={showJustificationDialog} onHide={() => setShowJustificationDialog(false)} task={selectedTask} userId={user?.user?.id} toast={toast} />
    </div>
  );
};

export default Home;
