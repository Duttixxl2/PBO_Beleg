<script setup>
import { ref, onMounted, computed } from 'vue';
import { useModuleStore } from '@/stores/module';
import { useRouter } from 'vue-router';
import { useTimetableStore } from '@/stores/timetable';

const router = useRouter();
const ModulStore = useModuleStore(); // Module Store
const TimetableStore = useTimetableStore(); // Timetable Store

const inputValue = ref('');
const nameValue = ref('');
const suggestions = ref([]);
const isGroupSearch = ref(false);

// Filter function for duplicate groups
const filteredGroups = computed(() => {
  const uniqueGroups = [];
  const seenGroups = new Set();

  for (const group of ModulStore.tempData) {
    if (!seenGroups.has(group.description)) {
      seenGroups.add(group.description);
      uniqueGroups.push(group);
    }
  }

  return uniqueGroups;
});

const toggleSearchOption = () => {
  isGroupSearch.value != true;
};

const getMatchingSuggestions = () => {
  return isGroupSearch.value ? getMatchingSuggestionsGroup(inputValue.value) : getMatchingSuggestionsSingle(inputValue.value);
};

const updateSugg = () => {
  suggestions.value = getMatchingSuggestions();
};

const selectSuggestion = (suggestion) => {
  inputValue.value = suggestion;
  suggestions.value = [];
};

const getMatchingSuggestionsSingle = (input) => {
  const regex = new RegExp(input, 'i');
  const matchedSuggestions = [];

  Object.values(ModulStore.data).forEach((modul) => {
    const suggestion = `${modul.dayName} - ${modul.description} - ${modul.typeAbbreviation} - ${modul.start}`;
    // Check if the module is not already added
    if (regex.test(suggestion) && !matchedSuggestions.includes(suggestion) && !ModulStore.tempData.find((addedModul) => addedModul.description === modul.description)) {
      matchedSuggestions.push(suggestion);
    }
  });

  return matchedSuggestions.slice(0, 5);
};


// Suggestions grouped by description
const getMatchingSuggestionsGroup = (input) => {
  const regex = new RegExp(input, 'i');
  const matchedSuggestions = [];

  Object.values(ModulStore.data).forEach((modul) => {
    const suggestion = `${modul.description}`;
    if (regex.test(suggestion) && !matchedSuggestions.includes(suggestion)) {
      matchedSuggestions.push(suggestion);
    }
  });

  return matchedSuggestions.slice(0, 5);
};  

const addToTable = () => {
  const selectedValue = inputValue.value;
  console.log(selectedValue);
  // Check if the selected module or group is not already added
  if (!ModulStore.tempData.find((addedModul) => addedModul.description === selectedValue)) {
    if (isGroupSearch.value) {
      // Handle adding a group and its modules
      const selectedGroup = Object.values(ModulStore.data).find((modul) => {
        const suggestion = `${modul.description}`;
        return suggestion === selectedValue;
      });

      if (selectedGroup) {
        ModulStore.addModule(selectedGroup);
        const groupModules = Object.values(ModulStore.data).filter((modul) => modul.description === selectedValue);
        groupModules.forEach((module) => {
          ModulStore.addModule(module);
        });
        console.log('Group added to the table:', selectedGroup);
      } else {
        console.error('Selected group not found:', selectedValue);
      }
    } else {
      // Handle adding a single module
      const selectedModule = Object.values(ModulStore.data).find((modul) => {
        const suggestion = `${modul.dayName} - ${modul.description} - ${modul.typeAbbreviation} - ${modul.start}`;
        return suggestion === selectedValue;
      });

      if (selectedModule) {
        ModulStore.addModule(selectedModule);
        console.log('Module added to the table:', selectedModule);
      } else {
        console.error('Selected module not found:', selectedValue);
      }
    }
  } else {
    console.warn('Module or group is already added:', selectedValue);
  }

  inputValue.value = '';
  suggestions.value = [];
};


const removeFromTable = (item) => {
  const confirmMessage = isGroupSearch.value
    ? `Are you sure you want to remove all modules in the group "${item.description}"?`
    : `Are you sure you want to remove the module "${item.description}"?`;

  if (window.confirm(confirmMessage)) {
    if (isGroupSearch.value) {
      // Remove all modules in the group
      const groupModules = Object.values(ModulStore.data).filter((modul) => modul.description === item.description);
      groupModules.forEach((module) => {
        ModulStore.removeModule(module);
        console.log('Module removed from the table:', module);
      });
    } else {
      // Remove a single module
      ModulStore.removeModule(item);
      console.log('Module removed from the table:', item);
    }
  } else {
    console.log('Removal canceled.');
  }
};



const clearTable = () => {
  ModulStore.clearTimetableData();
  console.log('All modules cleared from the table');
};


const createTimetable = async () => {
  const timetableName = document.getElementById('TTname').value;

  if (timetableName === '') {
    alert('Bitte geben Sie einen Namen für den Stundeplan ein!');
    return;
  } 

  if (TimetableStore.getDataByName(timetableName) != null && ModulStore.state == "create") {
    alert('Ein Stundeplan mit diesem Namen existiert bereits!');
    return;
  }
  console.log(ModulStore.tempData);
  await ModulStore.transform();
 
  if (ModulStore.state == "create") {
    TimetableStore.createTimetable(timetableName, ModulStore.tempData);
  } else if (ModulStore.state == "edit") {
    TimetableStore.updateTimetable(timetableName, ModulStore.tempData);
  }

  TimetableStore.setDefault(timetableName);
  ModulStore.clearTimetableData();
  router.push('/stundenplan_tagesansicht');
};

onMounted(() => {
  if (ModulStore.data === null) {
    ModulStore.fetchData();
  }
  nameValue.value = ModulStore.name;
});
</script>

<template>
  <div>
    <div id="search">
      <label class="search-label">
        <input type="checkbox" v-model="isGroupSearch" @change="toggleSearchOption" class="search-checkbox" />
        Search for Groups
      </label>
      <input v-model="inputValue" @input="updateSugg" placeholder="Search for a module" />
      <ul v-if="suggestions.length" class="suggestions-dropdown">
        <li v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
          {{ suggestion }}
        </li>
      </ul>
      <button @click="addToTable">Add</button>
      <input type="text" v-model="nameValue" id="TTname" placeholder="Name des Stundplans" style="margin-left: 5px;" required>
      <button @click="createTimetable">Speichern</button>
    </div>

    <!-- Display groups -->
    <div class="groups-section">
      <h2 class="section-title">Gruppe</h2>
      <div class="grid-container">
        <div v-for="group in filteredGroups" :key="group.id" class="grid-item group-item">
          {{ group.description }}
          <!-- Delete button -->
          <div class="delete" @click="removeFromTable(group)">
            <span>Delete</span>
          </div>
        </div>
      </div>
    </div>


    <!-- Display single modules -->
    <div class="groups-section">
      <h2 class="section-title">Einzeln</h2>
      <div class="grid-container">
        <div v-for="modul in ModulStore.tempData" :key="modul.id" class="grid-item">
          <!-- Display start and end time -->
          <div class="unterteilungStart">{{ modul.start }} <br /> - <br /> {{ modul.end  }}</div>

          <!-- Display activity details -->
          <div class="unterteilungMiddle">
            <h3>{{ modul.description }}</h3>
            <h5>{{ modul.lecturers }}</h5>

            <!-- Display location details -->
            <div class="container">
              <div class="raum">
                <h5>{{ modul.locations }}</h5>
              </div>

              <!-- Display activity type -->
              <div class="typ">
                <h5>{{ modul.typeDescription }}</h5>
              </div>
            </div>
          </div>
          <!-- Delete button -->
          <div class="unterteilungEnd" @click="removeFromTable(modul)">
            <span>Delete</span>
          </div>
        </div>
      </div>
      <button @click="clearTable">Clear All</button>
    </div>
  </div>
</template>

<style scoped>
#search {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 20px auto;
}

.search-label {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.search-checkbox {
  margin-right: 5px;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

button:hover {
  background-color: #45a049;
}

/* Search dropdown */
.suggestions-dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: 5px;
  border: 1px solid #ccc;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.suggestions-dropdown li {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestions-dropdown li:hover {
  background-color: #f0f0f0;
}

/* Card list */
.delete-button {
  cursor: pointer;
  color: #fff;
  background-color: #e74c3c;
  padding: 5px 10px;
  border-radius: 3px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 10px;
}

.grid-item {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-template-rows: 1fr;
  margin: 15px;
}

.unterteilungStart {
  border-radius: 25px 0px 0px 25px;
  border: solid 2px black;
  text-align: center;
  align-items: center;
  padding: 2px;
}

.unterteilungMiddle {
  display: grid;
  text-align: left;
  grid-gap: 2px;
  border: solid 2px black;
}

.unterteilungEnd {
  border-radius: 0px 25px 25px 0px;
  border: solid 2px black;
  text-align: center;
}

.delete {
  /* border-radius: 0px 25px 25px 0px;
  border: solid 2px black; */
  color: red;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.container {
  display: flex;
}

.raum {
  width: 50px;
  height: 24px;
  border-radius: 10px;
  border: solid 2px black;
  text-align: center;
}

.typ {
  padding: 1px;
  height: 24px;
  border-radius: 10px;
  border: solid 2px black;
  text-align: center;
}


/* Display groups */
.groups-section {
  margin-top: 20px;
}

.section-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.group-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.group-item {
  background-color: #f4f4f4;
  padding: 10px;
  /* margin-bottom: 5px; */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.group-item:hover {
  background-color: #e0e0e0;
}

</style>
