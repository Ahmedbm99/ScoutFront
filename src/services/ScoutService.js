import Api from "./Api";
const ScoutService = {

    getAllScouts() {
        return Api().get("/api/scout/getAllScouts");},

    getScoutList() {
        return Api().get("/api/scout/getScoutBySupervisor", )},
    getSuperviserList() {
        return Api().get("/api/scout/getSuperviseUsers", )},
    addSupervisor(credentials) {
        return Api().post("/api/scout/addSupervisor", credentials)},
    getScoutById(id) {
        return Api().get(`/api/scout/getScoutById/${id}`);
    },
    getScoutByName(name) {
        return Api().get(`/api/scout/getScoutByName/${name}`);
    },
    getUserTasks(userId) {
        return Api().get(`/api/scout/getUserTasks/${userId}`);
    },
    deleteUserTask(userId, taskId) {
        return Api().delete(`/api/scout/deleteUserTask/${userId}/${taskId}`);
    },
    addUserTask(credentials) {
        return Api().post("/api/scout/addUserTask", credentials);
    },
    addScout(credentials) {
        return Api().post("/api/register-member", credentials);
    },
    updateScout(userId,credentials) {
        return Api().put(`/api/scout/updateScout/${userId}`, credentials);
    },
    deleteScout(journeyId) {
        return Api().delete(`/api/scout/deleteScout/${journeyId}`);
    },

};

export default ScoutService;