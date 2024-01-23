import { defineStore } from 'pinia';

export const useTimetableStore = defineStore({
  id: 'Timetable',
  state: () => ({
    default: "21/041/62", //"21/041/62", // name of timetable currently active
    group: "21/041/62", //"21/041/62", // current group (data via api)
    list: [] // individual timetables available
  }),
  actions: {
    setDefault(val) {
      // Check if val is in the list or group and set it as the default timetable
      const foundTimetable = this.list.find(timetable => timetable.name === val);
      if (foundTimetable || this.group==val) {
        this.default = val;
      } else {
        console.error(`Timetable with name ${val} not found in the list or group.`);
      }
    },
    // set Group and check if group was default
    setGroup(val) {
      if (this.default==this.group) {
        this.default = val;
      }
      this.group=val;
    },
    setList(val) {
      // Ensure Val is an array
      if (!Array.isArray(val)) {
        console.error('Invalid argument. Expected an array.');
        return;
      }

      // Extract relevant information from each val
      const formattedVal = val.map(val => ({
        name: val.name || '', // Change this to the correct property name
        link: val.data || '',
      }));

      // Update the list in the store
      this.list = formattedVal;
    },
    addEntry(entry) {
      // Add a new entry to the list
      this.list.push(entry);
    },
    removeEntry(name) {
      // Remove an entry from the list based on the name
      const indexToRemove = this.list.findIndex(entry => entry.name === name);
      if (indexToRemove !== -1) {
        this.list.splice(indexToRemove, 1);
        // Check if default was removed
        if (this.default==name) {
          this.default = this.group;
        }
      } else {
        console.error(`Timetable with name ${name} not found in the list.`);
      }
    },
    updateTimetable(name, data) {
      // Find the entry in the list based on the name
      const entryToUpdate = this.list.find(entry => entry.name === name);

      if (entryToUpdate) {
        // Update the data property of the entry
        entryToUpdate.data = data;
      } else {
        console.error(`Timetable with name ${name} not found in the list.`);
      }
    },
    showDebug() {
      console.log(this.default);
      console.log(this.list);
    },
    createTimetable(name, data) {
      // Add a new entry to the list
      this.list.push({
        name: name,
        data: data
      });
    },
    getDataByName(name){
      // Find the entry in the list based on the name
      const entry = this.list.find(entry => entry.name === name);

      if (entry) {
        return entry.data;
      } else {
        console.log(`Timetable with name ${name} not found in the list.`);
        return null;
      }
    },
  },
  getters: {
    isDefault: (state) => (timetableName) => {
      return state.default === timetableName;
    },
  },
  persist: true,
});

// [
//    {
//      name: "Timetable 1",
//      data: {..timetable..}
//    },
// ]