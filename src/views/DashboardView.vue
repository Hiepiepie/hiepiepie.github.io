<script setup lang="ts">
import { ref } from "vue";
import {
  TrendingUp,
  Wallet,
  RefreshCw,
  ArrowRightLeft,
  PieChart,
  CircleArrowUp,
  CircleArrowDown,
  Settings,
} from "lucide-vue-next";
import {binanceLogo, coinbaseLogo} from "../utils/exchanges-logo.ts";
import {exchangeList} from "../utils/exchanges.ts";

// Mock data for demonstration
const walletBalance = ref("45,231.89");
const walletCurrency = ref("USD");
const percentChange = ref("+3.24%");
const isPositiveChange = ref(true);

const exchanges = ref(exchangeList);

const recentTransactions = ref([
  {
    type: "Received",
    amount: "+0.05 BTC",
    date: "2 days ago",
    from: "Exchange",
  },
  {
    type: "Sent",
    amount: "-0.4 ETH",
    date: "3 days ago",
    to: "Hardware Wallet",
  },
  { type: "Swap", amount: "150 USDT → 0.1 BNB", date: "1 week ago" },
]);

// Add a ref to track if refresh is active
const isRefreshing = ref(false);

// Function to handle refresh click
const handleRefresh = () => {
  if (isRefreshing.value) return; // Prevent multiple clicks while refreshing

  isRefreshing.value = true;

  // Simulate refresh with timeout
  setTimeout(() => {
    // Here you would typically fetch new data
    // For demo, just update some values randomly
    const newValue = Math.floor(40000 + Math.random() * 10000);
    walletBalance.value = newValue.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });

    const newPercent = (Math.random() * 8 - 2).toFixed(2);
    isPositiveChange.value = parseFloat(newPercent) >= 0;
    percentChange.value = `${isPositiveChange.value ? "+" : ""}${newPercent}%`;

    isRefreshing.value = false;
  }, 1500);
};
</script>

<template>
  <div class="min-h-screen text-white bg-gradient-to-b from-dark to-gray-800 px-4 !pt-19 py-12 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-cryo mb-2">
          CryoPort Dashboard
        </h1>
        <p class="text-gray-300 mb-8">
          Manage your crypto assets in one secure location
        </p>

        <!-- Wallet Card -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold flex items-center">
              <Wallet class="mr-2 text-cryo" size="24" />
              Total Balance
            </h2>
            <button
              @click="handleRefresh"
              :disabled="isRefreshing"
              class="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <RefreshCw
                size="20"
                :class="isRefreshing ? 'animate-spin text-cryo' : ''"
              />
            </button>
          </div>

          <div class="mb-4">
            <div class="text-3xl md:text-4xl font-bold">
              ${{ walletBalance }}
            </div>
            <div class="flex items-center mt-2">
              <span
                :class="isPositiveChange ? 'text-green-400' : 'text-red-400'"
                class="flex items-center"
              >
                <TrendingUp v-if="isPositiveChange" size="16" class="mr-1" />
                <TrendingUp
                  v-else
                  size="16"
                  class="mr-1 transform rotate-180"
                />
                {{ percentChange }}
              </span>
              <span class="text-gray-400 ml-2">24h</span>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <button
              class="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors"
            >
              <ArrowRightLeft class="text-cryo mb-2" size="24" />
              <span>Swap</span>
            </button>
            <button
              class="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors"
            >
              <circle-arrow-up
                class="text-cryo mb-2"
                size="24"/>
              <span>Send</span>
            </button>
            <button
              class="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors"
            >
              <circle-arrow-down
                class="text-cryo mb-2"
                size="24"/>
              <span>Receive</span>
            </button>
            <button
              class="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg flex flex-col items-center transition-colors"
            >
              <PieChart class="text-cryo mb-2" size="24" />
              <span>Portfolio</span>
            </button>
          </div>
        </div>

        <!-- Exchange Integrations -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <h2 class="text-xl font-bold mb-6">Exchange Integrations</h2>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(exchange, index) in exchanges"
              :key="index"
              class="border border-gray-700 rounded-lg p-4 flex flex-col items-center hover:border-cryo transition-colors cursor-pointer"
            >
              <img class="text-3xl mb-2" :src="exchange.logo" alt="Exchange logo" width="35" height="35"/>
              <div class="text-lg font-medium">{{ exchange.name }}</div>
              <div
                class="mt-2 px-3 py-1 rounded-full text-xs"
                :class="
                  exchange.connected
                    ? 'bg-green-900 text-green-200'
                    : 'bg-gray-700 text-gray-400'
                "
              >
                {{ exchange.connected ? "Connected" : "Connect" }}
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Recent Transactions</h2>
            <button class="text-cryo hover:underline text-sm">View all</button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(tx, index) in recentTransactions"
              :key="index"
              class="border-b border-gray-700 last:border-0 pb-4 last:pb-0"
            >
              <div class="flex justify-between">
                <div>
                  <div class="font-medium">{{ tx.type }}</div>
                  <div class="text-sm text-gray-400">{{ tx.date }}</div>
                </div>
                <div class="text-right">
                  <div :class="tx.type === 'Received' ? 'text-green-400' : ''">
                    {{ tx.amount }}
                  </div>
                  <div class="text-sm text-gray-400" v-if="tx.from">
                    From: {{ tx.from }}
                  </div>
                  <div class="text-sm text-gray-400" v-if="tx.to">
                    To: {{ tx.to }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
/* Custom animations or transitions can be added here */
.bg-dark {
  background-color: var(--color-dark);
}

.text-cryo {
  color: var(--color-cryo);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
