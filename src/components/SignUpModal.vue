<script setup lang="ts">
import { ref, watch } from "vue";
import { Eye, EyeOff, X, UserPlus } from "lucide-vue-next";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close", "sign-up-success"]);

const isVisible = ref(props.isOpen);
const isPasswordVisible = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const signupForm = ref({
  name: "",
  email: "",
  password: "",
  agreeToTerms: false,
});

// Form validation
const validation = ref({
  nameValid: true,
  emailValid: true,
  passwordValid: true,
  termsValid: true,
});

// Watch for prop changes
watch(
  () => props.isOpen,
  (newValue) => {
    isVisible.value = newValue;
  }
);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const closeModal = () => {
  resetForm();
  emit("close");
};

const resetForm = () => {
  signupForm.value = {
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  };
  errorMessage.value = "";
  validation.value = {
    nameValid: true,
    emailValid: true,
    passwordValid: true,
    termsValid: true,
  };
};

const validateForm = () => {
  validation.value.nameValid = !!signupForm.value.name;
  validation.value.emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    signupForm.value.email
  );
  validation.value.passwordValid = signupForm.value.password.length >= 8;
  validation.value.termsValid = signupForm.value.agreeToTerms;

  return (
    validation.value.nameValid &&
    validation.value.emailValid &&
    validation.value.passwordValid &&
    validation.value.termsValid
  );
};

const handleSignUp = async () => {
  if (!validateForm()) {
    errorMessage.value = "Please correct the errors in the form";
    return;
  }

  try {
    isLoading.value = true;
    errorMessage.value = "";

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would call your registration API
    console.log("User signup:", signupForm.value);

    // Emit success event
    emit("sign-up-success", { email: signupForm.value.email });

    // Close modal and reset form
    resetForm();
    closeModal();
  } catch (error) {
    errorMessage.value = "Registration failed. Please try again.";
    console.error("Signup error:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black bg-opacity-70"
      @click="closeModal"
    ></div>

    <!-- Modal -->
    <div
      class="bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700 w-full max-w-md relative z-10 m-4"
    >
      <!-- Close button -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X size="20" />
      </button>

      <!-- Header -->
      <div class="text-center mb-6">
        <UserPlus class="mx-auto mb-4 text-cryo" size="32" />
        <h2 class="text-2xl font-bold text-cryo">Create an Account</h2>
        <p class="text-gray-400 mt-2">
          Join CryoPort to track your crypto assets
        </p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="p-3 mb-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm"
      >
        {{ errorMessage }}
      </div>

      <!-- Sign Up Form -->
      <form @submit.prevent="handleSignUp" class="space-y-4">
        <!-- Name Input -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-400 mb-1"
            >Full Name</label
          >
          <input
            v-model="signupForm.name"
            id="name"
            name="name"
            type="text"
            class="bg-gray-700 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none text-white"
            :class="{ 'border border-red-500': !validation.nameValid }"
            placeholder="John Doe"
          />
          <p v-if="!validation.nameValid" class="mt-1 text-sm text-red-400">
            Name is required
          </p>
        </div>

        <!-- Email Input -->
        <div>
          <label
            for="signup-email"
            class="block text-sm font-medium text-gray-400 mb-1"
            >Email Address</label
          >
          <input
            v-model="signupForm.email"
            id="signup-email"
            name="email"
            type="email"
            class="bg-gray-700 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none text-white"
            :class="{ 'border border-red-500': !validation.emailValid }"
            placeholder="you@example.com"
          />
          <p v-if="!validation.emailValid" class="mt-1 text-sm text-red-400">
            Please enter a valid email address
          </p>
        </div>

        <!-- Password Input -->
        <div>
          <label
            for="signup-password"
            class="block text-sm font-medium text-gray-400 mb-1"
            >Password</label
          >
          <div class="relative">
            <input
              v-model="signupForm.password"
              id="signup-password"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              class="bg-gray-700 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none pr-10 text-white"
              :class="{ 'border border-red-500': !validation.passwordValid }"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Eye v-if="!isPasswordVisible" size="18" />
              <EyeOff v-else size="18" />
            </button>
          </div>
          <p v-if="!validation.passwordValid" class="mt-1 text-sm text-red-400">
            Password must be at least 8 characters
          </p>
        </div>

        <!-- Terms Checkbox -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              v-model="signupForm.agreeToTerms"
              id="terms"
              name="terms"
              type="checkbox"
              class="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-cryo"
              :class="{ 'border-red-500': !validation.termsValid }"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-400"
              >I agree to the
              <a href="#" class="text-cryo hover:underline">Terms of Service</a>
              and
              <a href="#" class="text-cryo hover:underline"
                >Privacy Policy</a
              ></label
            >
            <p v-if="!validation.termsValid" class="mt-1 text-red-400">
              You must agree to the terms to continue
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center bg-cryo hover:bg-opacity-90 text-dark font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isLoading ? "Creating account..." : "Sign Up" }}
          </button>
        </div>
      </form>

      <!-- Login Link -->
      <div class="text-center mt-6 text-sm text-gray-400">
        Already have an account?
        <router-link to="/login" class="text-cryo hover:underline ml-1"
          >Sign in</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-cryo {
  color: var(--color-cryo);
}
</style>
