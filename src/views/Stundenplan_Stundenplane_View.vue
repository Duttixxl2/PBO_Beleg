<template>
  <div id="app">
    <h2>Stundenpläne</h2>

    <!-- Display current group -->
    <div>
      <h3>Aktuelle Gruppe:</h3>
      <p>{{ $store.group }}</p>
      <button id="def" @click="$store.setDefault($store.group)" :class="{ 'btn-default': true, 'btn-checked': $store.isDefault($store.group) }"
            :disabled="$store.isDefault($store.group)">SetToDefault</button>
    </div>

    <!-- Display individual plans section -->
    <div>
      <h3>Individuelle Pläne:</h3>

      <!-- Conditional rendering based on the presence of timetables -->
      <ul v-if="$store.list.length > 0" class="timetable-list">
        <li v-for="timetable in $store.list" :key="timetable.name" class="timetable-item">
          <span>{{ timetable.name }}</span>
          <button id="def" @click="$store.setDefault(timetable.name)" :class="{ 'btn-default': true, 'btn-checked': $store.isDefault(timetable.name) }"
            :disabled="$store.isDefault(timetable.name)">SetToDefault</button>
          <button @click="editTimetable(timetable.name)" class="btn-edit">Edit</button>
          <button @click="deleteTimetable(timetable.name)" class="btn-delete">Delete</button>
        </li>
      </ul>
      <p v-else class="empty-message">Nothing there</p>

      <!-- Add button for adding a new timetable and route to create timetable view -->
      <button @click="goToCreateTimetable" class="btn-add-timetable">
        Add New Timetable
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// Import your store
import { useTimetableStore } from '@/stores/timetable';
import { useModuleStore } from '@/stores/module';
// Import the router from your setup
import { useRouter } from 'vue-router';

// Use the store
const $store = useTimetableStore();
const ModulStore = useModuleStore();
// Use the router
const $router = useRouter();

const eventData = ref([]);

const editTimetable = (name) => {
  console.log(`Editing timetable: ${name}`);
  ModulStore.state = "edit";
  process($store.getDataByName(name));
  ModulStore.setTimetableData(name,eventData.value);
  $router.push({ name: 'create_stundenplan' });
};

const deleteTimetable = (name) => {
  // Add your logic to handle deleting a timetable
  $store.removeEntry(name);
};

const goToCreateTimetable = () => {
  // Route to create timetable view
  ModulStore.state = "create";
  $router.push({ name: 'create_stundenplan' }); // Assuming 'createTimetable' is the name of your route
};

// Process the events from the store into fitting format
const process = (data) => {
  console.log(data);
  // Loop through each event in tempData
  data.forEach((event) => {
    // Extract relevant information from the event
    const {
      id,
      start,
      end,
      description,
      lecturers,
      locations,
      typeDescription,
    } = event;
    console.log(event.description);
    // Extract the first lecturer and location if available, otherwise set to an empty string
    const lecturerName = lecturers.length > 0 ? lecturers[0].name : '';
    const locationName = locations.length > 0 ? locations[0].name : '';

    // Push the extracted information into eventData
    eventData.value.push({
      id,
      start,
      end,
      description,
      lecturers: lecturerName,
      locations: locationName,
      typeDescription,
    });
  });
  console.log(eventData.value);
};

</script>


<style scoped>
  /* Add your custom styling here */
  #app {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  h2, h3 {
    margin-bottom: 10px;
  }

  .timetable-list {
    list-style-type: none;
    padding: 0;
  }

  .timetable-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .btn-edit, .btn-delete, .btn-default, .btn-add-timetable {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
  }
  .btn-edit:hover,.btn-add-timetable:hover {
    background-color: #008000; /* Darker shade on hover */
  }
  .btn-delete {
    background-color: #f44336;
  }
  .btn-delete:hover {
    background-color: #b30000; /* Darker shade on hover */
  }

  .btn-default {
    background-color: #2196F3;
  }
  .btn-default:hover {
    background-color: #0056b3; /* Darker shade on hover */
  }

  .btn-checked {
    background-color: #0056b3; /* Darker shade when checked */
  }

  .btn-default:disabled {
    cursor: not-allowed;
    opacity: 0.6; /* Dim the button when disabled */
  }
  .empty-message {
    color: #777;
    font-style: italic;
  }
</style>