<template>
  <div>
    <transition name="menu-fade">
      <div v-if="isMenuOpen" class="overlay" @click="closeMenu"></div>
    </transition>

    <transition name="menu-slide" mode="out-in">
      <div v-if="isMenuOpen" key="menu" class="menu">
        <button class="close-button" @click="closeMenu">Close</button>
        <router-link class="menu-button" to="/stundenplan_tagesansicht" @click.native="closeMenu">Tagesansicht</router-link>
        <router-link class="menu-button" to="/stundenplan_wochenansicht" @click.native="closeMenu">Wochenansicht</router-link>
        <router-link class="menu-button" to="/stundenplan_stundenplane" @click.native="closeMenu">Stundenpläne</router-link>
        <router-link class="menu-button" to="/create_stundenplan" @click.native="closeMenu">Stundenplan erstellen</router-link>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    isMenuOpen: Boolean,
  },
  methods: {
    closeMenu() {
      this.$emit('closeMenu');
    },
    navigateToPage(page) {
      this.$emit('navigate', page);
      this.closeMenu(); // Schließe das Menü nach der Navigation
    },
  },
};
</script>

<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: auto; /* Du kannst die Breite je nach Bedarf anpassen */
  height: 100%;
  background-color: #f0f0f0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  z-index: 2;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Links ausrichten */
  justify-content: center;
}

.close-button {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  border: 2px solid #333;
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.close-button:hover {
  background-color: #333;
  color: #fff;
}

.menu-button {
  font-size: 20px;
  border: 2px solid #333;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}

.menu-button:hover {
  background-color: #333;
  color: #fff;
}

.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.menu-slide-enter,
.menu-slide-leave-to {
  transform: translateX(-100%);
}
</style>
