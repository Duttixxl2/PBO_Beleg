<!-- src/components/minimal_components/Button_Firstview_Studiengruppe.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import { useSGDataStore } from '@/stores/studgruppen_data';
import { useRouter } from 'vue-router';
import { useTimetableStore } from '@/stores/timetable';

const router = useRouter();
const StudGrupStore = useSGDataStore(); // Studiengruppen Store
const TimetableStore = useTimetableStore(); // Timetable Store

// const placeholderText="Enter Information"  
const inputValue = ref('');
const suggestions = ref([]);
const status = ref('');


const updateSugg = () => {
  // Compare input value with the store data for suggestions
  suggestions.value =  getMatchingSuggestions(inputValue.value);
};

const selectSuggestion = (suggestion) => {
  // Set the selected suggestion as the input value
  inputValue.value = suggestion;
  // Clear suggestions
  suggestions.value = [];
  saveGroup();
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
const saveGroup = () => {
  const group = inputValue.value;
  TimetableStore.setGroup(group);
  TimetableStore.setDefault(group);
  TimetableStore.showDebug();
  router.push({ path: '/stundenplan_tagesansicht' });
};

onMounted(() => {
  // Fetch initial data when the component is mounted
  StudGrupStore.fetchData();
});
</script>

<template>
  <div id="search">
    <input v-model="inputValue" @input="updateSugg" @keyup.enter="saveGroup" :placeholder="placeholderText" />
    <button v-if="showButton" @click="saveGroup">OK</button>
    <div>{{ status }}</div>
    
    <!-- Suggestions dropdown -->
    <ul v-if="suggestions.length" class="suggestions-dropdown">
      <li v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)">
        {{ suggestion }}
      </li>
    </ul>
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

/* Add styles for the input field */
input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Style the button */
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

/* Style the suggestions dropdown */
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
</style>


<script>
export default {
  props: {
    showButton: {
      type: Boolean,
      default: false,
    },
    placeholderText: {
      type: String,
      default: 'Enter study group information',
    },
  },
};
</script>