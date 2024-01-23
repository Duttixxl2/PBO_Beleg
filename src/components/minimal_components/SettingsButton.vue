<template>
  <button class="settings-button" @click="$emit('openSettings')">Einstellungen</button>
</template>

<script>
export default {
  // props: [],
};
</script>

<style scoped>
.settings-button {
  font-size: 20px;
  border: 2px solid #333;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.settings-button:hover {
  background-color: #333;
  color: #fff;
}
</style>
