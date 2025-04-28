<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff, LogIn, Github, Twitter } from "lucide-vue-next";
import Cookies from 'js-cookie';
const router = useRouter();

const loginForm = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const isPasswordVisible = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const handleLogin = async () => {
  // Reset error message
  errorMessage.value = "";

  // Form validation
  if (!loginForm.value.email || !loginForm.value.password) {
    errorMessage.value = "Please enter both email and password";
    return;
  }

  try {
    isLoading.value = true;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would authenticate with an API
    // For demo purposes, we'll use a simple check
    if (
      loginForm.value.email === "demo@cryoport.com" &&
      loginForm.value.password === "password"
    ) {
      // Successful login - redirect to dashboard
      Cookies.set('isLoggedIn', 'true', { expires: 7 }); // Set cookie for 7 days
      window.location.href = '/';
    } else {
      errorMessage.value = "Invalid email or password";
    }
  } catch (error) {
    errorMessage.value = "Login failed. Please try again.";
    console.error("Login error:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleDemoLogin = () => {
  loginForm.value.email = "demo@cryoport.com";
  loginForm.value.password = "password";
  handleLogin();
};
</script>

<template>
  <div class="min-h-screen bg-dark flex items-center justify-center p-4">
    <div
      class="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700"
    >
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <img
          class="h-12 mx-auto mb-4"
          src="/images/CryoPort.svg"
          alt="CryoPort Logo"
        />
        <h1 class="text-2xl font-bold text-cryo">Welcome to CryoPort</h1>
        <p class="text-gray-400 mt-2">Sign in to your account to continue</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Email Input -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-400 mb-1"
            >Email Address</label
          >
          <input
            v-model="loginForm.email"
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="bg-gray-700 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none text-white"
            placeholder="you@example.com"
          />
        </div>

        <!-- Password Input -->
        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm font-medium text-gray-400 mb-1"
              >Password</label
            >
            <a href="#" class="text-xs text-cryo hover:underline"
              >Forgot password?</a
            >
          </div>
          <div class="relative">
            <input
              v-model="loginForm.password"
              id="password"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="bg-gray-700 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none pr-10 text-white"
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
        </div>

        <!-- Remember Me -->
        <div class="flex items-center">
          <input
            v-model="loginForm.rememberMe"
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-cryo"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-400"
            >Remember me</label
          >
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center bg-cryo hover:bg-opacity-90 text-dark font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
          >
            <LogIn v-if="!isLoading" size="18" class="mr-2" />
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
            {{ isLoading ? "Signing in..." : "Sign in" }}
          </button>
        </div>

        <!-- Demo Login -->
        <div class="text-center">
          <button
            type="button"
            @click="handleDemoLogin"
            class="text-sm text-cryo hover:underline"
          >
            Use demo account
          </button>
        </div>
      </form>

      <!-- Divider -->
      <div class="my-6 flex items-center justify-center">
        <div class="w-full border-t border-gray-700"></div>
        <div class="px-4 text-sm text-gray-500">OR</div>
        <div class="w-full border-t border-gray-700"></div>
      </div>

      <!-- Social Logins -->
      <div class="space-y-3">
        <button
          class="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          disabled
        >
          <Github size="18" class="mr-2" />
          <span>Continue with GitHub</span>
        </button>
        <button
          class="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          disabled
        >
          <Twitter size="18" class="mr-2" />
          <span>Continue with X (Twitter)</span>
        </button>
      </div>

      <!-- Sign Up Link -->
      <div class="text-center mt-6 text-sm text-gray-400">
        Don't have an account?
        <router-link to="/signup" class="text-cryo hover:underline ml-1"
          >Sign up</router-link
        >
      </div>
    </div>
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
