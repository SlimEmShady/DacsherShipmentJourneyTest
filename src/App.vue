<script setup lang="ts">
import TopBar from "@/components/layout/TopBar.vue";
</script>

<template>
  <v-app>
    <TopBar />

    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
