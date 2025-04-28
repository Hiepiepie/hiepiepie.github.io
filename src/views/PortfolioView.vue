<script setup lang="ts">
import { ref, computed } from "vue";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  Eye,
  EyeOff,
  Filter,
  Link,
  Globe,
  ArrowUpRight,
} from "lucide-vue-next";
import PieChart from "../components/PieChart.vue";
import {binanceLogo, coinbaseLogo} from "../utils/exchanges-logo.ts";
import LineChart from "../components/LineChart.vue";
import StackedLineChart from "../components/StackedLineChart.vue";

// Mock data for portfolio demonstration
const totalPortfolioValue = ref("72,489.35");
const isValueVisible = ref(true);
const portfolioChange = ref("+5.73%");
const isPositiveChange = ref(true);

// Asset allocation data
const assets = ref([
  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: "1.45",
    value: "35283.23",
    change24h: "+2.3%",
    changePositive: true,
    allocation: 48,
    color: "#F7931A",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: "12.76",
    value: "23653.89",
    change24h: "-1.2%",
    changePositive: false,
    allocation: 32,
    color: "#627EEA",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    amount: "5000.00",
    value: "5000.00",
    change24h: "0.0%",
    changePositive: true,
    allocation: 7,
    color: "#2775CA",
  },
  {
    name: "Cardano",
    symbol: "ADA",
    amount: "12500.56",
    value: "3875.23",
    change24h: "+4.7%",
    changePositive: true,
    allocation: 5,
    color: "#0033AD",
  },
  {
    name: "Solana",
    symbol: "SOL",
    amount: "62.35",
    value: "4677.00",
    change24h: "+7.8%",
    changePositive: true,
    allocation: 6,
    color: "#14F195",
  },
  {
    name: "Other Assets",
    symbol: "",
    amount: "",
    value: "1500.00",
    change24h: "",
    changePositive: true,
    allocation: 2,
    color: "#808080",
  },
]);

const toggleValueVisibility = () => {
  isValueVisible.value = !isValueVisible.value;
};

const sortOptions = ref([
  "Highest Value",
  "Lowest Value",
  "Highest 24h Change",
  "Lowest 24h Change",
  "A-Z",
]);

const selectedSort = ref("Highest Value");

// Compute total allocation (should be 100%)
const totalAllocation = computed(() => {
  return assets.value.reduce((sum, asset) => sum + asset.allocation, 0);
});

// Web3 wallet data
const web3Wallets = ref([
  {
    name: "MetaMask",
    icon: "🦊",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    shortAddress: "0x71C7...976F",
    balance: "2.34 ETH",
    usdValue: "4,329.56",
    networks: ["Ethereum", "Polygon", "Arbitrum"],
  },
  {
    name: "Phantom",
    icon: "👻",
    address: "5Gh7wk83NWBRA4V4KyNTtaiSekBH4tuz5gKrz8g3JN4u",
    shortAddress: "5Gh7...JN4u",
    balance: "52.7 SOL",
    usdValue: "3,950.78",
    networks: ["Solana"],
  },
  {
    name: "Ledger",
    icon: "🔒",
    address: "bc1q87jd0pszgr9swkl5ayerl48cqawytlcvmlj9qx",
    shortAddress: "bc1q...j9qx",
    balance: "0.18 BTC",
    usdValue: "7,236.42",
    networks: ["Bitcoin", "Ethereum"],
  },
]);

// Exchange data
const exchangeAccounts = ref([
  {
    name: "Binance",
    logo: binanceLogo,
    connected: true,
    lastSync: "5 minutes ago",
    apiHealth: "Good",
    totalBalance: "23,784.37",
    topAssets: [
      { symbol: "BTC", amount: "0.42", value: "16,891.25" },
      { symbol: "ETH", amount: "2.15", value: "3,984.75" },
      { symbol: "BNB", amount: "8.62", value: "2,908.37" },
    ],
  },
  {
    name: "Coinbase",
    logo: coinbaseLogo,
    connected: true,
    lastSync: "1 hour ago",
    apiHealth: "Good",
    totalBalance: "12,368.54",
    topAssets: [
      { symbol: "ETH", amount: "3.45", value: "6,396.74" },
      { symbol: "USDC", amount: "3,500.00", value: "3,500.00" },
      { symbol: "SOL", amount: "32.65", value: "2,471.80" },
    ],
  },
]);

const getWalletIcon = (name: string) => {
  if (name === "MetaMask") return "metamask-icon";
  if (name === "Phantom") return "phantom-icon";
  if (name === "Ledger") return "ledger-icon";
  return "wallet-icon";
};

const activeTab = ref("all"); // 'all', 'wallets', 'exchanges'

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="min-h-screen text-white bg-gradient-to-b from-dark to-gray-800 px-4 !pt-19 py-12 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-cryo mb-2">
          Portfolio Overview
        </h1>
        <p class="text-gray-300 mb-8">
          Track your crypto assets, allocation, and performance
        </p>

        <!-- Portfolio Value Card -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold flex items-center">
              <Wallet class="mr-2 text-cryo" size="24" />
              Total Portfolio Value
            </h2>
            <button
              @click="toggleValueVisibility"
              class="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <Eye v-if="isValueVisible" size="20" />
              <EyeOff v-else size="20" />
            </button>
          </div>

          <div class="mb-4">
            <div class="text-3xl md:text-4xl font-bold">
              <span v-if="isValueVisible">${{ totalPortfolioValue }}</span>
              <span v-else>••••••••</span>
            </div>
            <div class="flex items-center mt-2">
              <span
                :class="isPositiveChange ? 'text-green-400' : 'text-red-400'"
                class="flex items-center"
              >
                <TrendingUp v-if="isPositiveChange" size="16" class="mr-1" />
                <TrendingDown v-else size="16" class="mr-1" />
                {{ portfolioChange }}
              </span>
              <span class="text-gray-400 ml-2">7d</span>
            </div>
          </div>
        </div>

        <!-- Portfolio Navigation Tabs -->
        <div class="flex border-b border-gray-700 mb-8">
          <button
            @click="setActiveTab('all')"
            class="px-4 py-2 text-sm font-medium transition-colors"
            :class="
              activeTab === 'all'
                ? 'text-cryo border-b-2 border-cryo'
                : 'text-gray-400 hover:text-white'
            "
          >
            All Assets
          </button>
          <button
            @click="setActiveTab('wallets')"
            class="px-4 py-2 text-sm font-medium transition-colors"
            :class="
              activeTab === 'wallets'
                ? 'text-cryo border-b-2 border-cryo'
                : 'text-gray-400 hover:text-white'
            "
          >
            Web3 Wallets
          </button>
          <button
            @click="setActiveTab('exchanges')"
            class="px-4 py-2 text-sm font-medium transition-colors"
            :class="
              activeTab === 'exchanges'
                ? 'text-cryo border-b-2 border-cryo'
                : 'text-gray-400 hover:text-white'
            "
          >
            Exchanges
          </button>
        </div>

        <!-- Asset Allocation Chart (show only in "All" tab) -->
        <div
          v-if="activeTab === 'all'"
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <h2 class="text-xl font-bold mb-6 flex items-center">
            <BarChart3 class="mr-2 text-cryo" size="24" />
            Asset Allocation
          </h2>
          <StackedLineChart/>
        </div>

        <!-- Web3 Wallets Overview (show in wallets tab or all) -->
        <div
          v-if="activeTab === 'wallets' || activeTab === 'all'"
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold flex items-center">
              <Wallet class="mr-2 text-cryo" size="24" />
              Web3 Wallets
            </h2>
            <button
              class="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
            >
              <Link size="14" class="mr-1" />
              Connect Wallet
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="(wallet, index) in web3Wallets"
              :key="index"
              class="border border-gray-700 rounded-lg p-4 hover:border-cryo transition-colors"
            >
              <div class="flex justify-between">
                <div class="flex items-center">
                  <div class="text-2xl mr-3">{{ wallet.icon }}</div>
                  <div>
                    <h3 class="font-medium text-lg">{{ wallet.name }}</h3>
                    <div class="flex items-center">
                      <span class="text-xs text-gray-400">{{
                        wallet.shortAddress
                      }}</span>
                      <button
                        class="ml-2 p-1 text-xs text-gray-400 hover:text-cryo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path
                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-lg font-medium">${{ wallet.usdValue }}</div>
                  <div class="text-sm text-gray-400">{{ wallet.balance }}</div>
                </div>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="(network, nIdx) in wallet.networks"
                  :key="nIdx"
                  class="px-2 py-1 bg-gray-700 rounded-full text-xs"
                >
                  {{ network }}
                </span>
              </div>

              <div class="mt-4 flex justify-end gap-2">
                <button
                  class="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  View Assets
                </button>
                <button
                  class="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Transactions
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Exchange Accounts (show in exchanges tab or all) -->
        <div
          v-if="activeTab === 'exchanges' || activeTab === 'all'"
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold flex items-center">
              <Globe class="mr-2 text-cryo" size="24" />
              Exchange Accounts
            </h2>
            <button
              class="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
            >
              <Link size="14" class="mr-1" />
              Connect Exchange
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(exchange, index) in exchangeAccounts"
              :key="index"
              class="border border-gray-700 rounded-lg p-4 hover:border-cryo transition-colors"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center">
                  <img :src="exchange.logo" alt="Exchange Logo" width="24" height="24" class="mr-4" />
                  <div>
                    <h3 class="font-medium text-lg">{{ exchange.name }}</h3>
                    <div class="flex items-center">
                      <div class="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span class="text-xs text-gray-400"
                        >{{ exchange.apiHealth }} • Last sync
                        {{ exchange.lastSync }}</span
                      >
                    </div>
                  </div>
                </div>
                <a
                  href="#"
                  class="text-cryo hover:underline text-xs flex items-center"
                >
                  Visit Exchange
                  <ArrowUpRight size="12" class="ml-1" />
                </a>
              </div>

              <div class="mb-4 border-b border-gray-700 pb-3">
                <div class="text-sm text-gray-400">Total Balance</div>
                <div class="text-xl font-medium">
                  ${{ exchange.totalBalance }}
                </div>
              </div>

              <div>
                <div class="text-sm font-medium mb-2">Top Assets</div>
                <div class="space-y-2">
                  <div
                    v-for="(asset, aIdx) in exchange.topAssets"
                    :key="aIdx"
                    class="flex justify-between text-sm"
                  >
                    <div>{{ asset.amount }} {{ asset.symbol }}</div>
                    <div>${{ asset.value }}</div>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-end gap-2">
                <button
                  class="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Manage
                </button>
                <button
                  class="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Sync Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Assets List (show in all tabs) -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
          >
            <h2 class="text-xl font-bold">Your Assets</h2>

            <!-- Sorting options -->
            <div class="relative">
              <button
                class="flex items-center bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Filter size="16" class="mr-2" />
                {{ selectedSort }}
              </button>
              <!-- Dropdown for sort options would go here -->
            </div>
          </div>

          <!-- Assets table -->
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="text-left py-3 px-2 text-sm text-gray-400">
                    Asset
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    Balance
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    Value
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    24h Change
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(asset, index) in assets.slice(0, -1)"
                  :key="index"
                  class="border-b border-gray-700 hover:bg-gray-700/30"
                >
                  <td class="py-4 px-2">
                    <div class="flex items-center">
                      <div
                        class="h-8 w-8 rounded-full mr-3"
                        :style="{ backgroundColor: asset.color }"
                      ></div>
                      <div>
                        <div class="font-medium">{{ asset.name }}</div>
                        <div class="text-sm text-gray-400">
                          {{ asset.symbol }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span>{{ asset.amount }} {{ asset.symbol }}</span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span>${{ asset.value }}</span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span
                      :class="
                        asset.changePositive ? 'text-green-400' : 'text-red-400'
                      "
                    >
                      {{ asset.change24h }}
                    </span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        class="p-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Trade
                      </button>
                      <button
                        class="p-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
