import Api from "./Api";
const JourneyService = {

    getJourneyList() {
        return Api().get("/api/journey/getJourneyList");
    },
    getJourneyById(id) {
        return Api().get(`/api/journey/getJourneyById/${id}`);
    },
    getJourneyByName(name) {
        return Api().get(`/api/journey/getJourneyByName/${name}`);
    },
    createJourney(credentials) {
        return Api().post("/api/journey/createJourney", credentials);
    },
    updateJourney(credentials) {
        return Api().put("/api/journey/updateJourney", credentials);
    },
    deleteJourney(journeyId) {
        return Api().delete(`/api/journey/deleteJourney/${journeyId}`);
    },
getTaskUserStatuses: async (journeyId, taskIndex) => {
  
    return Api().get(`/api/journey/getTaskUserStatuses/${journeyId}/${taskIndex}`);
},

updateUserTaskStatus: async (journeyId, taskIndex, userId, done) => {

  return   Api().put(`/api/journey/updateUserTaskStatus/${journeyId}/${taskIndex}/${userId}`, { done });
},
};

export default JourneyService;