<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import SignUpModal from "../components/SignUpModal.vue";
import { UserPlus } from "lucide-vue-next";

const router = useRouter();
const showModal = ref(true);

const closeModal = () => {
  showModal.value = false;
  // Redirect to login after closing the modal
  router.push("/login");
};

const handleSignUpSuccess = (userData) => {
  // In a real app, you might show a success message or redirect
  console.log("Sign up successful:", userData);
  router.push("/login");
};
</script>

<template>
  <div
    class="min-h-screen bg-dark flex flex-col items-center justify-center p-4"
  >
    <div class="text-center mb-8">
      <img
        class="h-12 mx-auto mb-4"
        src="/images/CryoPort.svg"
        alt="CryoPort Logo"
      />
      <h1 class="text-2xl font-bold text-cryo">Create Your CryoPort Account</h1>
      <p class="text-gray-400 mt-2">Track and manage your crypto assets</p>
    </div>

    <button
      v-if="!showModal"
      @click="showModal = true"
      class="flex items-center bg-cryo hover:bg-opacity-90 text-dark font-medium py-3 px-6 rounded-lg transition duration-150 ease-in-out"
    >
      <UserPlus size="18" class="mr-2" />
      Sign Up
    </button>

    <SignUpModal
      :isOpen="showModal"
      @close="closeModal"
      @sign-up-success="handleSignUpSuccess"
    />
  </div>
</template>

<style scoped>
.bg-dark {
  background-color: var(--color-dark);
}

.text-cryo {
  color: var(--color-cryo);
}
</style>
