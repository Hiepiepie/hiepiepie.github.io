<script setup lang="ts">

import NavBar from "./components/NavBar.vue";
import Cookies from 'js-cookie';
import { ref } from 'vue';

// Mock authentication state - in a real app this would come from a store
const isLoggedIn = ref(Cookies.get('isLoggedIn') === 'true');
if (!isLoggedIn.value) {
  window.location.href = '/login';
}
const logout = () => {
  // In a real app, this would call an authentication service
  isLoggedIn.value = false;
  Cookies.remove('isLoggedIn');
  window.location.href = '/login';
};

</script>

<template>
  <NavBar :is-logged-in="isLoggedIn" :logout="logout"/>
  <RouterView class="pt-7"/>
</template>

<style scoped>

</style>
