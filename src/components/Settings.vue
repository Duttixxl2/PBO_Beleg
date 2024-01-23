<script setup>
  import { useTimetableStore } from '@/stores/timetable';
  import { useSGDataStore } from '@/stores/studgruppen_data';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';

  const TimetableStore = useTimetableStore();
  const StudGrupStore = useSGDataStore(); // Studiengruppen Store
  const router = useRouter();
  const selectedAppearance = ref('light');
  const selectedLanguage = ref('de');
  const selectedSchedule = ref(TimetableStore.default);
  const inputValue = ref(TimetableStore.group);
  const suggestions = ref([]);

  const applySettings = () => {
    // Implementiere die Logik zum Anwenden der Einstellungen
    console.log('Einstellungen angewendet:', inputValue.value, selectedLanguage.value, selectedAppearance.value, selectedSchedule.value);
    // save Group //////////////////
    const group = inputValue.value;
    TimetableStore.setGroup(group);
    TimetableStore.setDefault(group);
    // TimetableStore.showDebug();

    // save Default ////////////////
    TimetableStore.setDefault(selectedSchedule.value);

    // save Language ///////////////
    // work in progress

    // save Appearance /////////////
    //geht nicht
    document.body.classList.toggle('dark-mode', selectedAppearance.value === 'dark');

    // some reload needed
    // router.push({ path: '/stundenplan_tagesansicht' });
  };


const updateSugg = () => {
  // Compare input value with the store data for suggestions
  suggestions.value =  getMatchingSuggestions(inputValue.value);
};

const selectSuggestion = (suggestion) => {
  // Set the selected suggestion as the input value
  inputValue.value = suggestion;
  // Clear suggestions
  suggestions.value = [];
  // saveGroup();
};

const getMatchingSuggestions = (input) => {
  const regex = new RegExp(input, 'i');
  const matchedSuggestions = [];

  StudGrupStore.data.forEach(year =>
    year.studyCourses.forEach(course =>
      course.studyGroups.forEach(group => {
        const suggestion = `${year.studyYear}/${course.studyCourse}/${group.studyGroup}`;
        if (regex.test(suggestion) && !matchedSuggestions.includes(suggestion)) {
          matchedSuggestions.push(suggestion);
        }
      })
    )
  );
  return matchedSuggestions.slice(0, 5); // Limit to the first 5 suggestions
};

// Saves group in store and routes to Main View
// const saveGroup = () => {
//   const group = inputValue.value;
//   TimetableStore.setGroup(group);
//   TimetableStore.setDefault(group);
//   TimetableStore.showDebug();
//   router.push({ path: '/stundenplan_tagesansicht' });
// };


onMounted(() => {
  // Fetch initial data when the component is mounted
  if(StudGrupStore.data == null){
    StudGrupStore.fetchData();
  }
  selectedSchedule.value = TimetableStore.default;
});
</script>
<template>
  <div>
    <transition name="settings-fade">
      <div v-if="areSettingsOpen" class="overlay" @click="closeSettings"></div>
    </transition>

    <transition name="settings-slide" mode="out-in">
      <div v-if="areSettingsOpen" key="settings" class="settings">
        <button class="close-button" @click="closeSettings">Schließen</button>

        <!-- Eingabe der Studiengruppe -->
        <div class="setting">
          <label for="">Studiengruppe:</label>
          <input v-model="inputValue" @input="updateSugg" class="input-field"/>
          <!-- Suggestions dropdown -->
          <ul v-if="suggestions.length" class="suggestions-dropdown">
            <li v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
              {{ suggestion }}
            </li>
          </ul>
          <!-- <Input_Studygroup :showButton="Boolean(false)" :placeholderText="TimetableStore.group"/> -->
        </div>

        <!-- Auswahl der Sprache -->
        <div class="setting">
          <label for="language">Sprache:</label>
          <select class="dropdown" id="language" v-model="selectedLanguage">
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
          </select>
        </div>

        <!-- Auswahl des Erscheinungsbildes -->
        <div class="setting">
          <label for="appearance">Erscheinungsbild:</label>
          <select class="dropdown" id="appearance" v-model="selectedAppearance">
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
          </select>
        </div>

        <!-- Auswahl des angezeigten Stundenplans -->
        <div class="setting">
          <label for="schedule">Angezeigter Stundenplan:</label>
          <select class="dropdown" id="schedule" v-model="selectedSchedule">
            <option :value="TimetableStore.group">{{ TimetableStore.group }}</option>
            <option v-for="timetable in TimetableStore.list" :key="timetable.name" :value="timetable.name">{{ timetable.name }}</option>
          </select>
        </div>        

        <!-- Anwenden-Button -->
        <button class="apply-button" @click="applySettings">Anwenden</button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
    props: {
        areSettingsOpen: Boolean,
    },
    data() {
        return {
            studyGroup: '',
            selectedLanguage: 'de',
            selectedAppearance: 'light',
            selectedSchedule: '',
            availableSchedules: [
                { id: 'schedule1', name: 'Stundenplan 1' },
                { id: 'schedule2', name: 'Stundenplan 2' },
                // Weitere Stundenpläne hier hinzufügen
            ],
        };
    },
    methods: {
        closeSettings() {
            this.$emit('closeSettings');
        },
    },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.settings {
  position: fixed;
  top: 0;
  right: 0;
  width: auto; /* Breite anpassen, wenn benötigt */
  height: 100%;
  background-color: #f0f0f0;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 2;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Links ausrichten */
  justify-content: center;
}

.close-button,
.dropdown,
.input-field,
.apply-button {
  font-size: 16px;
  border: 2px solid #333;
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background-color 0.3s, color 0.3s;
  width: auto; /* Alle Felder gleich breit */
}

.close-button:hover,
.dropdown:hover,
.input-field:hover,
.apply-button:hover {
  background-color: #333;
  color: #fff;
}

.input-field {
  width: calc(100% - 22px); /* Abzüglich des Border-Paddings */
}

.dropdown {
  width: calc(100% - 22px); /* Abzüglich des Border-Paddings */
  margin-bottom: 10px; /* Etwas Abstand zum nächsten Element */
}

.apply-button {
  margin-top: 10px; /* Etwas Abstand zum vorherigen Element */
}

/* Schriften linksbündig */
label {
  text-align: left;
}


.suggestions-dropdown {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px; /* Set a maximum height to limit the dropdown size */
  overflow-y: auto; /* Enable vertical scrolling if needed */

  /* Customize the dropdown appearance */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.suggestions-dropdown li {
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.suggestions-dropdown li:hover {
  background-color: #f0f0f0;
}

</style>
