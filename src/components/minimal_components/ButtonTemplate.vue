<template>
  <button
    :style="{ ...buttonStyle, backgroundColor: buttonHover ? hoverColor : buttonColor }"
    @mouseover="buttonHover = true"
    @mouseout="buttonHover = false"
  >
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  data() {
    return {
      buttonHover: false
    };
  },
  props: {
    buttonText: {
      type: String,
      default: "Click me"
    },
    buttonColor: {
      type: String,
      default: "#808080" // Standardmäßig auf Grau setzen
    },
    hoverColor: {
      type: String,
      default: "rgba(0, 0, 0, 0.8)" // Standardmäßig abgedunkelt
    }
  },
  computed: {
    buttonStyle() {
      return {
        borderRadius: "5px", // Feste Eckenwerte
        color: "white",
        cursor: "pointer",
        border: "none",
        outline: "none",
        padding: "10px 15px",
        transition: "background-color 0.3s"
      };
    }
  }
};
</script>

<style scoped>
/* Hier könnten zusätzliche Stilregeln stehen, wenn nötig */
</style>
