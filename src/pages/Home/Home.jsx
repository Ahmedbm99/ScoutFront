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
  const [ setSelectedUserTasks] = useState([]);
  const [setShowUserTaskDialog] = useState(false);
  const [showAllPendingDialog, setShowAllPendingDialog] = useState(false);
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);
  const [supervisorData, setSupervisorData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    isAdmin: true,
  });
  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    isAdmin: false,
  });
  const [userList, setUserList] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const currentUser = AuthenticationService.getCurrentUser();
    setUser(currentUser);
    if (currentUser?.isAdmin) {
      UserTaskService.getPendingUserTasks().then(setPendingTasks);
      loadUsers();
      loadPendingTasks();
      loadSupervisors();
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
  const loadPendingTasks = async () => {
    try {
      const tasks = await UserTaskService.getPendingUserTasks();
      setPendingTasks(tasks);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de charger les tâches en attente",
      });
    }
  };
  const handleAddSupervisor = async () => {
    try {
      const res = await ScoutService.addSupervisor({
        ...supervisorData,
        supervisorId: null,
      });
      const created = res.data;
      await ScoutService.updateScout(created.id, {
        supervisorId: created.id,
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
        isAdmin: true,
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
      setSupervisors(res.data);
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
  return (
    <div className="min-h-screen">
    
    <Navbar />
    <div className="min-h-screen flex flex-col">
      <Toast ref={toast} />
      
      <main className="flex-grow max-w-screen-lg mx-auto px-4 py-6 w-full">
        <h2 className="text-2xl md:text-4xl mb-6">Bienvenue, {user?.username}</h2>

        {user?.isAdmin ? (
          <div className="mb-6 bg-blue-100 p-4 rounded flex flex-wrap gap-3 justify-start">
            <Button
              label="➕ Ajouter une Journée"
              className="mb-2"
              onClick={() => setShowAddJourney(true)}
            />
            <Button
              label="👤 Ajouter un Superviseur"
              className="mb-2"
              onClick={() => setShowAddSupervisor(true)}
            />
            <Button
              label="👤 Ajouter un Utilisateur"
              className="mb-2"
              onClick={() => setShowAddUser(true)}
            />
            <Button
              label="📋 Liste des utilisateurs"
              className="mb-2"
              onClick={() => {
                loadUsers();
                setShowUserList(true);
              }}
            />
            <Button
              label="📨 Tâches à approuver"
              className="mb-2"
              onClick={() => setShowAllPendingDialog(true)}
            />
            <div className="w-full mt-4">
              <AdminUserProgression users={userList} />
            </div>
          </div>
        ) : (
          <p className="mb-4 text-lg">Profitez de votre camping.</p>
        )}

        <div className="overflow-x-auto w-full">
          <JourneyPanel
            openEditTaskModal={openEditTaskModal}
            openJustificationDialog={openJustificationDialog}
          />
        </div>
      </main>

      <AddSupervisorDialog
        visible={showAddSupervisor}
        onHide={() => setShowAddSupervisor(false)}
        supervisorData={supervisorData}
        setSupervisorData={setSupervisorData}
        onSave={handleAddSupervisor}
        style={{ width: "90vw", maxWidth: "600px" }}
      />
      <AddUserDialog
        visible={showAddUser}
        onHide={() => setShowAddUser(false)}
        supervisors={supervisors}
        newUserData={newUserData}
        setNewUserData={setNewUserData}
        onSave={handleAddUser}
        style={{ width: "90vw", maxWidth: "600px" }}
      />
      <AddJourneyDialog
        visible={showAddJourney}
        onHide={() => setShowAddJourney(false)}
        newJourneyNumber={newJourneyNumber}
        setNewJourneyNumber={setNewJourneyNumber}
        newJourneyTheme={newJourneyTheme}
        setNewJourneyTheme={setNewJourneyTheme}
        newJourneyDate={newJourneyDate}
        setNewJourneyDate={setNewJourneyDate}
        newTasks={newTasks}
        setNewTasks={setNewTasks}
        onSave={handleAddJourney}
        style={{ width: "90vw", maxWidth: "600px" }}
      />
      <UserListDialog
        visible={showUserList}
        onHide={() => setShowUserList(false)}
        userList={userList}
        style={{ width: "90vw", maxWidth: "600px" }}
      />
      <EditTaskDialog
        visible={showEditTask}
        onHide={() => setShowEditTask(false)}
        taskToEdit={taskToEdit}
        setTaskToEdit={setTaskToEdit}
        onSave={() => {}}
        style={{ width: "90vw", maxWidth: "600px" }}
      />
      <AdminPendingTasksDialog
        visible={showAllPendingDialog}
        onHide={() => setShowAllPendingDialog(false)}
        pendingTasks={pendingTasks}
        onSelectUserTasks={(tasks) => {
          setSelectedUserTasks(tasks);
          setShowUserTaskDialog(true);
        }}
        onTaskUpdated={loadPendingTasks}
        style={{ width: "90vw", maxWidth: "600px" }}
      />
      <JustificationDialog
        visible={showJustificationDialog}
        onHide={() => setShowJustificationDialog(false)}
        task={selectedTask}
        userId={user?.id}
        toast={toast}
        style={{ width: "90vw", maxWidth: "600px" }}
      />
    </div>
    </div>
  );
};

export default Home;
