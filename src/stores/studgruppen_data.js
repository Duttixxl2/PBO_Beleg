import { defineStore } from 'pinia'
import axios from 'axios';



export const useSGDataStore = defineStore({
  id: 'StudiengruppenData',
  state: () => ({
    data: null,
  }),
  actions: {
    setData(data) {
      this.data = data
    },
    fetchData() {
      axios({
        method: 'get',
        url: '/api',
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
  },
  persist: true,
})