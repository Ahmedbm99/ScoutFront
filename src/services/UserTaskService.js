import Api from "./Api";

const UserTaskService = {
    async getUserTasks(userId) {
        try {
        const response = await Api().get(`/api/scout/getUserTasks/${userId}`);
        return response.data;
        } catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
        }
    },
    async getPendingUserTasks() {
  try {
    const response = await Api().get("/api/scout/getPendingUserTasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending user tasks:", error);
    throw error;
  }
},

  async approveUserTask(id, data) {
    try  {
        const response = await Api().put(`/api/scout-task/${id}/approve`, data);
        return response.data;
    }catch (error) {
        console.error("Error approving user task:", error);
        throw error;
    }
        },

    async addUserTask(credentials) {
        try {
        const response = await Api().post("/api/scout/addUserTask", credentials);
        return response.data;
        } catch (error) {
        console.error("Error adding user task:", error);
        throw error;
        }
    },
    async  getUsersProgressions(userIds) {
  const ids = userIds.join(",");
  const response = await Api().get(`/api/scout-task/users-progressions/${ids}`);
  return response.data;
},
    async deleteUserTask(userId, taskId) {
        try {
        const response = await Api().delete(`/api/scout/deleteUserTask/${userId}/${taskId}`);
        return response.data;
        } catch (error) {
        console.error("Error deleting user task:", error);
        throw error;
        }
    },

    async addUserTaskToMultipleUsers({ userIds, TaskId }) {
  try {

    const response = await Api().post('/api/scout/addUserTaskToMultipleUsers', { userIds, TaskId });
    return response.data;
  } catch (error) {
    console.error("Error adding user tasks to multiple users:", error);
    throw error;
  }
},
async submitUserTaskJustification(formData) {
  try {
    const taskId = formData.get("TaskId");
    const response = await Api().patch(`/api/tasks/${taskId}/justify`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting justification:", error);
    throw error;
  }
},
};
export default UserTaskService;
   