import { defineStore } from 'pinia'
import axios from 'axios';

export const useModuleStore = defineStore({
  id: 'ModuleData',
  state: () => ({
    data: null, // store for all modules
    state: null, // create, edit
    name: null, // store for name of timetable
    tempData: [], // store for current data of new/selected timetable
  }),
  actions: {
    fetchData() {
      axios({
        method: 'get',
        url: '/module',
        auth: {
          username: import.meta.env.VITE_API_USER,
          password: import.meta.env.VITE_API_PASSWORD,
        }
      }).then(async (response) => {
        this.setData(response.data);
      }).catch((error) => {
        console.debug('Error fetching data:', error);
        //this.setData('Error fetching data:');
      });
    },
    setData(data) {
      this.data = data
    },
    setTimetableData(name,data) {
      this.name = name
      this.tempData = data
    },
    clearTimetableData() {
      this.name = null;
      this.tempData = []
    },
    // add module to timetable
    addModule(module) {
      // check if module is already in timetable
      if (this.tempData.find((m) => m.id === module.id)) {
        return
      }
      this.tempData.push(module)
    },
    // remove module from timetable
    removeModule(module) {
      this.tempData = this.tempData.filter((m) => m.id !== module.id)
    },
    // transform tempData to detailed version via api
    async transform() {
      //check if tempData is empty
      if (this.tempData.length == 0) {
        return
      }
      let data = [];
      let apiCalls = [];

      // iterate over all modules in tempData
      this.tempData.forEach((module) => {
        // create an API call promise for each module
        let apiCall = axios({
          method: 'get',
          url: '/module' + module.id,
          auth: {
            username: import.meta.env.VITE_API_USER,
            password: import.meta.env.VITE_API_PASSWORD,
          }
        }).then(async (response) => {
          // add detailed module data to data
          data.push(response.data);
        }).catch((error) => {
          console.debug('Error fetching data:', error);
          data.push('Error fetching data:');
        });

        apiCalls.push(apiCall);
      });

      // wait for all API calls to complete
      await Promise.all(apiCalls);

      // set data to new tempData
      this.tempData = data;
    }
  },
  persist: true,
})