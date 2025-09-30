<script setup lang="ts">
import { useTheme } from 'vuetify';
import {onMounted} from "vue";

const theme = useTheme();

// Methods
const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'customLightTheme' : 'customDarkTheme';
  theme.global.name.value = newTheme;

  // Save the theme in localStorage
  localStorage.setItem('userTheme', newTheme);
}

// Lifecycle
onMounted(() => {
  // Get the theme from localStorage and apply it
  const savedTheme = localStorage.getItem('userTheme');
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});
</script>

<template>
  <v-app-bar elevation="0" color="primary">
    <v-app-bar-title>
      Dachser Platform - Shipment Journey
    </v-app-bar-title>

    <template v-slot:append>
      <v-switch icon-color="secondary" base-color="secondary" class="d-flex" v-model="theme.global.current.value.dark" @click="toggleTheme" append-icon="mdi-theme-light-dark"></v-switch>
    </template>
  </v-app-bar>
</template>

<style scoped>
.v-toolbar {
  border-bottom: 2px solid #fbba00;
}
</style>
