<template>
  <!-- Display status -->
  <div class="status">{{ status }}</div>
  
  <!-- Check if eventData is empty -->
  <div v-if="eventData.length === 0" class="tags">
    <div class="veranstaltungsfrei">Veranstaltungsfrei</div>
  </div>

  <!-- Display events if eventData is not empty -->
  <div v-else v-for="modul in eventData" :key="modul.id" class="tags">
    <!-- Display start and end time -->
    <div class="unterteilung zeit">{{ modul.start }} <br /> - <br /> {{ modul.end }}</div>

    <!-- Display activity details -->
    <div class="unterteilung2">
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
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import { useTimetableStore } from '@/stores/timetable';
import axios from 'axios';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const TimetableStore = useTimetableStore();

const eventData = ref([]);
const status = ref('');

// Process the events from the API response into fitting format (group)
const processEventsForGroup = (dataFromResponse) => {
  // console.log("data From Response:  ");
  // console.log(dataFromResponse);

  const events = dataFromResponse.activities || {};

  // console.log("events")
  
  // console.log(events);
  const startTimes = dataFromResponse.dates[getTestDay()] || [];
  // console.log("StartTimes: ")
  // let i = 0;
  // console.log(startTimes);
  eventData.value = startTimes.map((startTime) => {
    const event = events[startTime.id];
    const locationName = event.locations.length > 0 ? event.locations[0].name : '';
    const lecturers = event.lecturers.length > 0 ? event.lecturers[0].description : '';
    // i +=1;
    // console.log(i);
    return {
      id: event.id,
      start: startTime.startTime,
      end: event.end,
      description: event.description,
      lecturers: lecturers,
      locations: locationName,
      typeDescription: event.typeDescription,
    };
  });
};

const processEventsForIndividual = (dataFromResponse) => {
  // Loop through each event in dataFromResponse
  dataFromResponse.forEach((event) => {
    // Check if the event occurs on the specified day
    if (event.dates.includes(getTestDay())) {
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
      // console.log(eventData.value);
    }
  });  
  // Sort eventData based on start time
  eventData.value.sort((a, b) => {
    const timeA = a.start;
    const timeB = b.start;
    return timeA.localeCompare(timeB);
  });

  // Return the filtered and sorted eventData
  return eventData;
};

// Get today's date in the correct format
const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTestDay = () => {
  return "2024-01-08";  
};

// Fetch timetable data from API and call processEvents
const fetchTimetable = () => {
  status.value = 'Loading...';
  if (TimetableStore.default == TimetableStore.group) {
    const timetableUrl = getTimetableUrl(TimetableStore.default);
    console.log(timetableUrl);
    axios({
      method: 'get',
      url: timetableUrl,
      auth: {
        username: import.meta.env.VITE_API_USER,
        password: import.meta.env.VITE_API_PASSWORD,
      }
    }).then(async (response) => {
      console.log(response.data);
      status.value = '';
      processEventsForGroup(response.data);
    }).catch((error) => {
      console.error('Error fetching data:', error);
      status.value = 'Invalid Group or no Timetable available';
    });
  } else {
    const data = TimetableStore.getDataByName(TimetableStore.default);
    if (data) {
      status.value = '';
      // eventData.value = data;
      processEventsForIndividual(data);
    }
  }  
};

const getTimetableUrl = (input) => {
  const formatRegex = /^\d+\/\d+\/\d+$/;
  if (!formatRegex.test(input)) {
    console.error('Incorrect format');
    status.value = 'Incorrect format';
    return '';
  }

  const [studyYear, studyCourse, studyGroup] = input.split('/');
  status.value = '';
  return "/api" + `${studyYear}_${studyCourse}_${studyGroup}`;
};

onMounted(() => {
  fetchTimetable();
});
</script>

<style scoped>
.tags {
  display: grid;
  grid-template-columns: 70px 1fr;
  border-radius: 30px;
  border: solid 2px black;
  margin: 15px;
  width: 100% !important;
  height: 90% !important;
}

.veranstaltungsfrei {
  text-align: center;
  padding: 20px;
  color: black;
}

.unterteilung {
  border-radius: 25px 0px 0px 25px;
  border: solid 2px black;
  text-align: center;
}

.unterteilung2 {
  display: grid;
  text-align: left;
  grid-gap: 2px;
  width: 100%;
  height: 100%;
  border-radius: 0px 25px 25px 0px;
  border: solid 2px black;
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
  width: auto;
  padding: 1px;
  height: 24px;
  border-radius: 10px;
  border: solid 2px black;
  text-align: center;
}

h3, zeit {
  color: black;
}

.status {
  margin-top: 2px;
}
</style>
