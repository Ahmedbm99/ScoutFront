import Api from "./Api";
const TaskService = {

    getTaskList() {
        return Api().get("/api/task/getTaskList");
    },
    getTaskById(id) {
        return Api().get(`/api/task/getTaskyById/${id}`);
    },
    getTaskByJourney(name) {
        return Api().get(`/api/task/getTaskByJourney/${name}`);
    },
    addTask(credentials) {
        return Api().post("/api/task/createTask", credentials);
    },
    updateTask(id,credentials) {
        return Api().put(`/api/task/updateTask/${id}`, credentials);
    },
    deleteTask(TaskId) {
        return Api().delete(`/api/task/deleteTask/${TaskId}`);
    },

};

export default TaskService;