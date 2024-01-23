<template>
  <div class="wrap">
    <div class="left">
      <DayPilotNavigator id="nav" :config="navigatorConfig" />
    </div>
    <div class="content">
      <DayPilotCalendar id="dp" :config="config" ref="calendar" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useTimetableStore } from '@/stores/timetable';

const router = useRouter();
const TimetableStore = useTimetableStore();

const eventData = ref([]);
const status = ref('');

onMounted(() => {
  fetchTimetable();
});

const getTestDay = () => {
  return "2024-01-09";
};

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



const formatDate = (date) => {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
};

const processEventsForGroup = (dataFromResponse) => {
  // console.log(dataFromResponse);
  let i = 0;
  const startDate = new Date(dataFromResponse.semesterStart);
  const endDate = new Date(dataFromResponse.semesterEnd);
  
  let inputDate = new Date(startDate);

  let startTimes=[];

  for(inputDate; inputDate<=endDate ; inputDate.setDate(inputDate.getDate() +1) ){
    
    startTimes = dataFromResponse.dates[formatDate(inputDate)] || [];  
    
    eventData.value = startTimes.map((startTime) => {
    const event = dataFromResponse.activities[startTime.id];
    const locationName = event.locations.length > 0 ? event.locations[0].name : '';
    const lecturers = event.lecturers.length > 0 ? event.lecturers[0].description : '';
    return {
      id: i+=1,
      start: formatDate(inputDate) + "T" + startTime.startTime + ":00",
      end: formatDate(inputDate) + "T" + event.end + ":00",
      text: event.description +" " + locationName ,
      typeDescription: event.typeDescription,
    };
  });
  console.log(eventData.value);
};}



const processEventsForIndividual = (dataFromResponse) => {
  dataFromResponse.forEach((event) => {
    if (event.dates.includes(getTestDay())) {
      const {
        id,
        start,
        end,
        description,
        lecturers,
        locations,
        typeDescription,
      } = event;

      const lecturerName = lecturers.length > 0 ? lecturers[0].name : '';
      const locationName = locations.length > 0 ? locations[0].name : '';

      eventData.value.push({
        id,
        start,
        end,
        description,
        lecturers: lecturerName,
        locations: locationName,
        typeDescription,
      });
    }
  });

  eventData.value.sort((a, b) => {
    const timeA = a.start;
    const timeB = b.start;
    return timeA.localeCompare(timeB);
  });

  return eventData;
};
</script>

<style>
.wrap {
  display: flex;
}

.left {
  margin-right: 10px;
}

.content {
  flex-grow: 1;
}

.calendar_default_event_inner {
  background: #2e78d6;
  color: white;
  border-radius: 5px;
  opacity: 0.9;
}
</style>


<!-- <template>
    <div class="wrap">
      <div class="left">
        <DayPilotNavigator id="nav" :config="navigatorConfig" />
      </div>
      <div class="content">
        <DayPilotCalendar id="dp" :config="config" ref="calendar" />
      </div>
    </div>
  </template>
  -->
  <script>
  import {DayPilot, DayPilotCalendar, DayPilotNavigator} from '@daypilot/daypilot-lite-vue'
 
  export default {
    name: 'Calendar',
    data: function() {
      return {
        events: [],
        navigatorConfig: {
          showMonths: 3,
          skipMonths: 3,
          selectMode: "Week",
          startDate: "2022-03-01",
          selectionDay: "2022-02-28",
          onTimeRangeSelected: args => {
            this.config.startDate = args.day;
          }
        },
        config: {
          viewType: "Week",
          startDate: "2022-02-28",
          durationBarVisible: false,
          timeRangeSelectedHandling: "Enabled",
          onTimeRangeSelected: async (args) => {
            const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
            const dp = args.control;
            dp.clearSelection();
            if (modal.canceled) {
              return;
            }
            dp.events.add({
              start: args.start,
              end: args.end,
              id: DayPilot.guid(),
              text: modal.result
            });
          },
          eventDeleteHandling: "Disabled",
          onEventMoved: () => {
            console.log("Event moved");
          },
          onEventResized: () => {
            console.log("Event resized");
          },
        },
      }
    },
    props: {
    },
    components: {
      DayPilotCalendar,
      DayPilotNavigator
    },
    computed: {
      // DayPilot.Calendar object - https://api.daypilot.org/daypilot-calendar-class/
      calendar() {
        return this.$refs.calendar.control;
      }
    },
    methods: {
      loadEvents() {
        // placeholder for an HTTP call
        const events = [
          {
            id: 1,
            start: "2022-02-28T10:00:00",
            end: "2022-02-28T11:00:00",
            text: "Event 1",
            backColor: "#6aa84f",
            borderColor: "#38761d",
          },
          {
            id: 2,
            start: "2022-02-28T13:00:00",
            end: "2022-02-28T16:00:00",
            text: "Event 2",
            backColor: "#f1c232",
            borderColor: "#bf9000",
          },
          {
            id: 3,
            start: "2022-03-01T13:30:00",
            end: "2022-03-01T16:30:00",
            text: "Event 3",
            backColor: "#cc4125",
            borderColor: "#990000",
          },
          {
            id: 4,
            start: "2022-03-01T10:30:00",
            end: "2022-03-01T12:30:00",
            text: "Event 4"
          },
        ];
        this.calendar.update({events});
      },
    },
    mounted() {
      this.loadEvents();
    }
  }
  </script><!--
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useTimetableStore } from '@/stores/timetable';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const TimetableStore = useTimetableStore();
  
  const eventData = ref([]);
  const status = ref('');
  
  onMounted(() => {
      fetchTimetable();
  });
  const getTestDay = () => {
    return "2024-01-09";  
  }

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

  function formatDate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}



  const processEventsForGroup = (dataFromResponse) => {

  const inputDateString = dataFromResponse.semesterStart;
  const targetDate = dataFromResponse.semesterEnd;

  const inputDate = new Date(inputDateString);
  
  inputDate.setDate(inputDate.getDate() - 1);
  const resultDateString = formatDate(inputDate);

  console.log(dataFromResponse.semesterStart);

  const startTimes = dataFromResponse.dates[dataFromResponse.semesterStart] || [];
  //startTimes = json2array(dataFromResponse);
  eventData.value = startTimes.map((startTime) => {
    //console.log(startTime);
  const event = dataFromResponse.activities[startTime.id];
  const locationName = event.locations.length > 0 ? event.locations[0].name : '';
  const lecturers = event.lecturers.length > 0 ? event.lecturers[0].description : '';
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
  console.log(eventData.value);
  };
  
  // Process the events from the store into fitting format (individual)
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
  // Return the processed eventData
  return eventData;
  };
  </script>






  <style>
  .wrap {
    display: flex;
  }
  
  .left {
    margin-right: 10px;
  }
  
  .content {
    flex-grow: 1;
  }
  
  
  .calendar_default_event_inner {
    background: #2e78d6;
    color: white;
    border-radius: 5px;
    opacity: 0.9;
  }
  </style> -->