<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {MenuIcon, X, UserIcon} from "lucide-vue-next";

const props = defineProps<{
  isLoggedIn: boolean,
  logout: () => void
}>();

const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);


const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const isNavVisible = ref(true);
let lastScrollY = window.scrollY;

const handleScroll = () => {
  if (window.scrollY < 50) {
    isNavVisible.value = true;
    lastScrollY = window.scrollY;
    return;
  }
  if (window.scrollY > lastScrollY) {
    // Scrolling down
    isNavVisible.value = false;
  } else {
    // Scrolling up
    isNavVisible.value = true;
  }
  lastScrollY = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// With router-link, we don't need the navigateTo function anymore
</script>

<template>
  <nav v-if="isLoggedIn"
      class="bg-dark text-cryo shadow-lg fixed w-full z-10 transition-all duration-200 ease-in-out"
       :class="isNavVisible ? 'translate-y-0' : '-translate-y-full'">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and brand name -->
        <div class="flex-shrink-0 flex items-center">
          <img class="h-8 w-auto" src="/images/CryoPort.svg" alt="CryoPort Logo" />
        </div>

        <!-- Desktop navigation links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-center space-x-4">
            <router-link to="/"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-700">
              Dashboard
            </router-link>
            <router-link to="/portfolio"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-700">
              Portfolio
            </router-link>
            <router-link to="/pnl"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-700">
              P&L
            </router-link>
            <router-link to="/whalewatch"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-700">
              Whale Watch
            </router-link>
            <router-link to="/settings"
              class="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
              active-class="bg-gray-700">
              Settings
            </router-link>
          </div>
        </div>

        <!-- User profile and mobile menu button -->
        <div class="flex items-center">
          <div class="hidden md:block ml-3">
            <button @click="toggleUserMenu"
                class="bg-gray-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ">
              <span class="sr-only">Open user menu</span>
              <div class="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                <UserIcon/>
              </div>
            </button>
          </div>
          <div class="hidden md:block ml-3">
            <div class="text-base font-medium">User Name</div>
            <div class="text-sm font-medium text-gray-400">user@example.com</div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden bg-dark ml-2">
            <button @click="toggleMenu" type="button" class="bg-dark hover:bg-gray-700 hover:text-white cursor-pointer inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white relative">
              <div class="relative w-6 h-6">
                <MenuIcon
                    class="text-cryo absolute top-0 left-0 transition-all duration-300 ease-in-out"
                    :class="isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'"
                />
                <X
                    class="text-cryo absolute top-0 left-0 transition-all duration-300 ease-in-out"
                    :class="isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User profile menu -->
    <div class="hidden md:block absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5
     overflow-hidden transition-all duration-300 ease-in-out z-50"
         :class="isUserMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
      <div class="py-1">
        <a class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">Your Profile</a>
        <a @click="props.logout()" class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer">Sign out</a>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="block absolute w-full bg-dark overflow-hidden transition-all duration-300 ease-in-out"
    :class="isMenuOpen ? 'h-fit opacity-100' : 'max-h-0 opacity-0'">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link to="/"
                     class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
                     active-class="bg-gray-700">
          Dashboard
        </router-link>
        <router-link to="/portfolio"
                     class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
                     active-class="bg-gray-700">
          Portfolio
        </router-link>
        <router-link to="/pnl"
                     class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
                     active-class="bg-gray-700">
          P&L
        </router-link>
        <router-link to="/whalewatch"
                     class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
                     active-class="bg-gray-700">
          Whale Watch
        </router-link>
        <router-link to="/settings"
                     class="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
                     active-class="bg-gray-700">
          Settings
        </router-link>
      </div>

      <!-- Mobile profile menu -->
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
              <UserIcon/>
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium">User Name</div>
            <div class="text-sm font-medium text-gray-400">user@example.com</div>
          </div>
        </div>
        <div class="mt-3 px-2 space-y-1">
          <a class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer">Your Profile</a>
          <a @click="props.logout()" class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer mb-2">Sign out</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Any additional custom styling */
</style>