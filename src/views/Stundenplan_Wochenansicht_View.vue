<script setup>
    import TimetableLayout from '../components/TimetableLayout.vue'
    import Button_Stundenplan_Header_Switch from '../components/minimal_components/Button_Stundenplan_Header_Switch.vue';
    //import Stundenplan_Header from '../components/Stundenplan_Header.vue';
</script>

<template>
    <div id="app">
        <Button_Stundenplan_Header_Switch />
        <!--   <Stundenplan_Header /> -->
        <TimetableLayout />
    </div>
</template>