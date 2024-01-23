<template>
    <div>
      <router-link :to="buttonPath" class="button">{{ buttonText }}</router-link>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        buttonPath: "",
        buttonText: ""
      };
    },
    mounted() {
      this.buttonPath = this.$route.path === '/stundenplan_tagesansicht' ? '/stundenplan_wochenansicht' : '/stundenplan_tagesansicht';
      this.buttonText = this.$route.path === '/stundenplan_tagesansicht' ? 'Zur Wochenansicht' : 'Zur Tagesansicht';
    }
  };
  </script>
  
  <style scoped>
  .button {
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  