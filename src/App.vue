<script>
import { RouterLink, RouterView } from 'vue-router';
import MenuButton from "./components/minimal_components/MenuButton.vue";
import SettingsButton from "./components/minimal_components/SettingsButton.vue"; // Füge die SettingsButton-Komponente hinzu
import Menu from "./components/Menu.vue";
import Settings from "./components/Settings.vue"; // Füge die Settings-Komponente hinzu

export default {
  data() {
    return {
      isMenuOpen: false,
      areSettingsOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    navigateToPage(page) {
      // Implementiere die Navigation zu der ausgewählten Seite hier
      console.log(`Navigiere zu ${page}`);
    },
    openSettings() {
      this.areSettingsOpen = true;
    },
    closeSettings() {
      this.areSettingsOpen = false;
    },
  },
  components: {
    MenuButton,
    SettingsButton,
    Menu,
    Settings,
  },
};
</script>

<template>
  <div id="app">
    <MenuButton @toggleMenu="toggleMenu" class="menu-button-top-left" />
    <SettingsButton @openSettings="openSettings" class="settings-button-top-right" /> <!-- Hier den SettingsButton hinzufügen -->
    <Menu :isMenuOpen="isMenuOpen" @closeMenu="closeMenu" @navigate="navigateToPage" />
    <Settings :areSettingsOpen="areSettingsOpen" @closeSettings="closeSettings" /> <!-- Hier die Settings-Komponente hinzufügen -->
    <div class="main-content">
      <RouterView/>
    </div>
  </div>
</template>

<style scoped>
.menu-button-top-left {
  position: absolute;
  top: 10px;
  left: 10px;
}

.settings-button-top-right {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>