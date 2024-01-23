<template>
    <div id="app">
        <div class="square">
            <h1>{{ message }}</h1>
            <h1>{{ message2 }}</h1>
        </div>
        <Input_Studygroup />
    </div>
  </template>
  
  <script>
import Input_Studygroup from '../components/minimal_components/Input_Studygroup.vue';

  export default {
    data() {
        return {
            message: "Willkommen!",
            message2: "Bitte trage deinen Studiengang ein!",
            inputValue: "" // Hier wird der eingegebene Wert gespeichert
        };
    },
    components: { Input_Studygroup }
};
  
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .square {
  display: inline-block;
  padding: 20px;
  border: 2px solid black;
}
  h1 {
    font-size: 2em;
    margin-bottom: 20px;
  }
  </style>
  