<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  Settings,
  Key,
  Wallet,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Check,
  AlertCircle,
  Building2,
  CopyIcon
} from "lucide-vue-next";
import {binanceLogo, coinbaseLogo} from "../utils/exchanges-logo.ts";

// Tab navigation
const activeTab = ref("exchanges");
const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};

// Exchange API configuration
const exchangeConfigs = reactive({
  binance: {
    name: "Binance",
    apiKey: "",
    apiSecret: "",
    isConnected: false,
    isValid: false,
    isValidating: false,
    lastSynced: null,
    showSecret: false,
    error: "",
  },
  coinbase: {
    name: "Coinbase",
    apiKey: "",
    apiSecret: "",
    isConnected: false,
    isValid: false,
    isValidating: false,
    lastSynced: null,
    showSecret: false,
    error: "",
  },
});

// Toggle show/hide secret key
const toggleShowSecret = (exchange: string) => {
  exchangeConfigs[exchange].showSecret = !exchangeConfigs[exchange].showSecret;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    settingsFeedback.message = "Copied to clipboard!";
    settingsFeedback.isError = false;
    settingsFeedback.isVisible = true;
    setTimeout(() => (settingsFeedback.isVisible = false), 1500);
  } catch (e) {
    settingsFeedback.message = "Failed to copy";
    settingsFeedback.isError = true;
    settingsFeedback.isVisible = true;
    setTimeout(() => (settingsFeedback.isVisible = false), 1500);
  }
};

// Validate exchange API keys
const validateExchangeKeys = async (exchange: string) => {
  const config = exchangeConfigs[exchange];

  if (!config.apiKey || !config.apiSecret) {
    config.error = "API Key and Secret are required";
    return;
  }

  config.isValidating = true;
  config.error = "";

  try {
    // Simulate API validation with delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes - in real app this would call an API
    // Random success/failure for demonstration
    if (Math.random() > 0.3) {
      config.isValid = true;
      config.isConnected = true;
      config.lastSynced = new Date();
      config.error = "";
    } else {
      config.isValid = false;
      config.error = "Invalid API credentials";
    }
  } catch (error) {
    config.error = "Validation failed. Please try again.";
    console.error(`${exchange} validation error:`, error);
  } finally {
    config.isValidating = false;
  }
};

// Wallet management
const wallets = ref([
  {
    id: 1,
    name: "Main ETH Wallet",
    type: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    isActive: true,
  },
  {
    id: 2,
    name: "Cold Storage BTC",
    type: "Bitcoin",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    isActive: true,
  },
]);

// New wallet form
const newWallet = reactive({
  name: "",
  type: "Ethereum",
  address: "",
  isEditing: false,
  error: "",
  isValid: false,
});

// Available blockchain types
const blockchainTypes = [
  "Ethereum",
  "Bitcoin",
  "Solana",
  "Polygon",
  "Binance Smart Chain",
  "Avalanche",
  "Cardano",
];

// Wallet validation
const validateWalletAddress = () => {
  const { type, address } = newWallet;

  if (!address) {
    newWallet.isValid = false;
    return;
  }

  // Simple format validation based on blockchain
  // In production, use more robust validation libraries
  switch (type) {
    case "Ethereum":
      newWallet.isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      break;
    case "Polygon":
      newWallet.isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      break;
    case "Binance Smart Chain":
      newWallet.isValid = /^0x[a-fA-F0-9]{40}$/.test(address);
      break;
    case "Bitcoin":
      // Very basic check - production would need better validation
      newWallet.isValid = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);
      break;
    case "Solana":
      newWallet.isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      break;
    default:
      // Basic check for other chains
      newWallet.isValid = address.length > 30;
  }

  newWallet.error = newWallet.isValid ? "" : "Invalid wallet address format";
};

// Add new wallet
const addWallet = () => {
  if (!newWallet.name || !newWallet.address) {
    newWallet.error = "Name and address are required";
    return;
  }

  validateWalletAddress();

  if (!newWallet.isValid) {
    return;
  }

  const newId =
    wallets.value.length > 0
      ? Math.max(...wallets.value.map((w) => w.id)) + 1
      : 1;

  wallets.value.push({
    id: newId,
    name: newWallet.name,
    type: newWallet.type,
    address: newWallet.address,
    isActive: true,
  });

  // Reset form
  newWallet.name = "";
  newWallet.type = "Ethereum";
  newWallet.address = "";
  newWallet.isEditing = false;
  newWallet.error = "";
  newWallet.isValid = false;
};

// Remove wallet
const removeWallet = (id: number) => {
  wallets.value = wallets.value.filter((wallet) => wallet.id !== id);
};

// Application preferences
const preferences = reactive({
  theme: "dark",
  currency: "USD",
  notifications: true,
  autoSync: true,
  syncInterval: 30, // minutes
});

// General success/error feedback
const settingsFeedback = reactive({
  message: "",
  isError: false,
  isVisible: false,
});

// Save preferences
const savePreferences = () => {
  // Simulate saving preferences
  settingsFeedback.message = "Settings saved successfully";
  settingsFeedback.isError = false;
  settingsFeedback.isVisible = true;

  setTimeout(() => {
    settingsFeedback.isVisible = false;
  }, 3000);
};

// Watch for changes to validate wallet address
const handleAddressInput = () => {
  validateWalletAddress();
};
</script>

<template>
  <div class="min-h-screen text-white bg-gradient-to-b from-dark to-gray-800 px-4 !pt-19 py-12 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto relative">
        <h1 class="text-3xl md:text-4xl font-bold text-cryo mb-2">Settings</h1>
        <p class="text-gray-300 mb-8">
          Configure your account, connections and preferences
        </p>

        <!-- Settings Navigation Tabs -->
        <div class="flex border-b border-gray-700 mb-8 overflow-x-auto">
          <button
            @click="setActiveTab('exchanges')"
            class="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            :class="
              activeTab === 'exchanges'
                ? 'text-cryo border-b-2 border-cryo'
                : 'text-gray-400 hover:text-white'
            "
          >
            <Key size="16" class="inline mr-1" /> Exchange API Keys
          </button>
          <button
            @click="setActiveTab('wallets')"
            class="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            :class="
              activeTab === 'wallets'
                ? 'text-cryo border-b-2 border-cryo'
                : 'text-gray-400 hover:text-white'
            "
          >
            <Wallet size="16" class="inline mr-1" /> Wallets
          </button>
          <button
            @click="setActiveTab('preferences')"
            class="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            :class="
              activeTab === 'preferences'
                ? 'text-cryo border-b-2 border-cryo'
                : 'text-gray-400 hover:text-white'
            "
          >
            <Settings size="16" class="inline mr-1" /> Preferences
          </button>
        </div>

        <!-- Feedback message -->
        <div
          :class="[
            settingsFeedback.isError ? 'bg-red-900/30 border-red-800': 'bg-green-900/30 border-green-800',
            settingsFeedback.isVisible ? 'opacity-100' : 'opacity-0'
          ]"
          class="mb-6 p-3 border rounded-lg text-sm flex items-center fixed bottom-4 right-1/2 transition-opacity duration-300"
        >
          <Check
            v-if="!settingsFeedback.isError"
            size="16"
            class="mr-2 text-green-400"
          />
          <AlertCircle v-else size="16" class="mr-2 text-red-400" />
          {{ settingsFeedback.message }}
        </div>

        <!-- Exchange API Keys Tab -->
        <div v-if="activeTab === 'exchanges'" class="space-y-6">
          <!-- Binance -->
          <div
            class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
          >
            <div class="flex items-center mb-6">
              <img :src="binanceLogo" alt="Binance Logo" width="24" height="24"  class="text-2xl mr-3" />
              <h2 class="text-xl font-bold">Binance API Configuration</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >API Key</label
                >
                <input
                  v-model="exchangeConfigs.binance.apiKey"
                  type="text"
                  class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                  placeholder="Enter your Binance API key"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >API Secret</label
                >
                <div class="relative">
                  <input
                    v-model="exchangeConfigs.binance.apiSecret"
                    :type="
                      exchangeConfigs.binance.showSecret ? 'text' : 'password'
                    "
                    class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none pr-10"
                    placeholder="Enter your Binance API secret"
                  />
                  <button
                    @click="toggleShowSecret('binance')"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <Eye v-if="!exchangeConfigs.binance.showSecret" size="16" />
                    <EyeOff v-else size="16" />
                  </button>
                </div>
              </div>

              <div
                v-if="exchangeConfigs.binance.error"
                class="text-red-400 text-sm"
              >
                {{ exchangeConfigs.binance.error }}
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span
                    v-if="exchangeConfigs.binance.isConnected"
                    class="flex items-center text-green-400 text-sm"
                  >
                    <Check size="14" class="mr-1" />
                    Connected
                    <span class="text-gray-400 ml-2">
                      Last synced:
                      {{
                        exchangeConfigs.binance.lastSynced
                          ? new Date(
                              exchangeConfigs.binance.lastSynced
                            ).toLocaleString()
                          : "Never"
                      }}
                    </span>
                  </span>
                </div>

                <button
                  @click="validateExchangeKeys('binance')"
                  :disabled="
                    !exchangeConfigs.binance.apiKey ||
                    !exchangeConfigs.binance.apiSecret ||
                    exchangeConfigs.binance.isValidating
                  "
                  class="bg-cryo hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed text-dark font-medium rounded-lg px-4 py-2 text-sm transition-colors flex items-center"
                >
                  <RefreshCw
                    v-if="exchangeConfigs.binance.isValidating"
                    size="14"
                    class="mr-2 animate-spin"
                  />
                  <Check
                    v-else-if="exchangeConfigs.binance.isValid"
                    size="14"
                    class="mr-2"
                  />
                  {{
                    exchangeConfigs.binance.isConnected
                      ? "Refresh Connection"
                      : "Connect to Binance"
                  }}
                </button>
              </div>
            </div>
          </div>

          <!-- Coinbase -->
          <div
            class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
          >
            <div class="flex items-center mb-6">
              <img :src="coinbaseLogo" alt="Coinbase Logo" width="24" height="24" class="text-2xl mr-3" />
              <h2 class="text-xl font-bold">Coinbase API Configuration</h2>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >API Key</label
                >
                <input
                  v-model="exchangeConfigs.coinbase.apiKey"
                  type="text"
                  class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                  placeholder="Enter your Coinbase API key"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >API Secret</label
                >
                <div class="relative">
                  <input
                    v-model="exchangeConfigs.coinbase.apiSecret"
                    :type="
                      exchangeConfigs.coinbase.showSecret ? 'text' : 'password'
                    "
                    class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none pr-10"
                    placeholder="Enter your Coinbase API secret"
                  />
                  <button
                    @click="toggleShowSecret('coinbase')"
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <Eye
                      v-if="!exchangeConfigs.coinbase.showSecret"
                      size="16"
                    />
                    <EyeOff v-else size="16" />
                  </button>
                </div>
              </div>

              <div
                v-if="exchangeConfigs.coinbase.error"
                class="text-red-400 text-sm"
              >
                {{ exchangeConfigs.coinbase.error }}
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span
                    v-if="exchangeConfigs.coinbase.isConnected"
                    class="flex items-center text-green-400 text-sm"
                  >
                    <Check size="14" class="mr-1" />
                    Connected
                    <span class="text-gray-400 ml-2">
                      Last synced:
                      {{
                        exchangeConfigs.coinbase.lastSynced
                          ? new Date(
                              exchangeConfigs.coinbase.lastSynced
                            ).toLocaleString()
                          : "Never"
                      }}
                    </span>
                  </span>
                </div>

                <button
                  @click="validateExchangeKeys('coinbase')"
                  :disabled="
                    !exchangeConfigs.coinbase.apiKey ||
                    !exchangeConfigs.coinbase.apiSecret ||
                    exchangeConfigs.coinbase.isValidating
                  "
                  class="bg-cryo hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed text-dark font-medium rounded-lg px-4 py-2 text-sm transition-colors flex items-center"
                >
                  <RefreshCw
                    v-if="exchangeConfigs.coinbase.isValidating"
                    size="14"
                    class="mr-2 animate-spin"
                  />
                  <Check
                    v-else-if="exchangeConfigs.coinbase.isValid"
                    size="14"
                    class="mr-2"
                  />
                  {{
                    exchangeConfigs.coinbase.isConnected
                      ? "Refresh Connection"
                      : "Connect to Coinbase"
                  }}
                </button>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-800/50 rounded-lg p-4 mt-6 border border-gray-700/50 text-sm text-gray-400"
          >
            <p>
              <AlertCircle size="14" class="inline mr-1" />
              API keys are stored securely and encrypted. CryoPort requires
              read-only API access and cannot execute trades or withdraw funds.
            </p>
          </div>
        </div>

        <!-- Wallets Tab -->
        <div v-if="activeTab === 'wallets'" class="space-y-6">
          <!-- Wallets List -->
          <div
            class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold flex items-center">
                <Wallet class="mr-2 text-cryo" size="24" />
                Your Wallets
              </h2>
              <button
                @click="newWallet.isEditing = !newWallet.isEditing"
                class="bg-cryo hover:bg-opacity-80 text-dark font-medium rounded-lg px-4 py-2 text-sm transition-colors flex items-center"
              >
                <Plus size="14" class="mr-1" />
                Add Wallet
              </button>
            </div>

            <!-- New Wallet Form -->
            <div
              v-if="newWallet.isEditing"
              class="mb-6 bg-gray-700/50 p-4 rounded-lg border border-gray-600"
            >
              <h3 class="font-medium mb-4">Add New Wallet</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1"
                    >Wallet Name</label
                  >
                  <input
                    v-model="newWallet.name"
                    type="text"
                    class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                    placeholder="My ETH Wallet"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1"
                    >Blockchain</label
                  >
                  <select
                    v-model="newWallet.type"
                    class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                  >
                    <option
                      v-for="type in blockchainTypes"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-400 mb-1"
                    >Wallet Address</label
                  >
                  <input
                    v-model="newWallet.address"
                    @input="handleAddressInput"
                    type="text"
                    class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                    :class="{ 'border border-red-500': newWallet.error }"
                    placeholder="0x..."
                  />
                  <p v-if="newWallet.error" class="mt-1 text-sm text-red-400">
                    {{ newWallet.error }}
                  </p>
                </div>
              </div>

              <div class="flex justify-end gap-2">
                <button
                  @click="newWallet.isEditing = false"
                  class="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="addWallet"
                  :disabled="!newWallet.name || !newWallet.address"
                  class="bg-cryo hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed text-dark font-medium rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  Add Wallet
                </button>
              </div>
            </div>

            <!-- Wallets Table -->
            <div class="overflow-x-auto">
              <table v-if="wallets.length > 0" class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-3 px-2 text-sm text-gray-400">
                      Wallet Name
                    </th>
                    <th class="text-left py-3 px-2 text-sm text-gray-400">
                      Type
                    </th>
                    <th class="text-left py-3 px-2 text-sm text-gray-400">
                      Address
                    </th>
                    <th class="text-right py-3 px-2 text-sm text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="wallet in wallets"
                    :key="wallet.id"
                    class="border-b border-gray-700 hover:bg-gray-700/30"
                  >
                    <td class="py-4 px-2">{{ wallet.name }}</td>
                    <td class="py-4 px-2">{{ wallet.type }}</td>
                    <td class="py-4 px-2">
                      <div class="flex items-center">
                        <span class="truncate max-w-sm">{{
                          wallet.address
                        }}</span>
                        <CopyIcon @click="copyToClipboard(wallet.address)"
                                  size="16" class="text-gray-400 ml-1 hover:!cursor-pointer hover:text-gray-100"/>
                      </div>
                    </td>
                    <td class="py-4 px-2 text-right">
                      <button
                        @click="removeWallet(wallet.id)"
                        class="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size="16" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="text-center py-8 text-gray-400">
                <Building2 size="48" class="mx-auto mb-4 opacity-50" />
                <p>No wallets added yet</p>
                <p class="text-sm">
                  Add your first wallet to track your assets
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-gray-800/50 rounded-lg p-4 mt-6 border border-gray-700/50 text-sm text-gray-400"
          >
            <p>
              <AlertCircle size="14" class="inline mr-1" />
              Adding your wallet address allows CryoPort to read public
              blockchain data. Your private keys always stay secure in your
              wallet.
            </p>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="space-y-6">
          <div
            class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
          >
            <h2 class="text-xl font-bold flex items-center mb-6">
              <Settings class="mr-2 text-cryo" size="24" />
              Application Preferences
            </h2>

            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1"
                    >Theme</label
                  >
                  <select
                    v-model="preferences.theme"
                    class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1"
                    >Display Currency</label
                  >
                  <select
                    v-model="preferences.currency"
                    class="bg-gray-700 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="BTC">BTC (₿)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2"
                  >Data Synchronization</label
                >

                <div class="flex items-center mb-2">
                  <input
                    id="auto-sync"
                    v-model="preferences.autoSync"
                    type="checkbox"
                    class="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-cryo"
                  />
                  <label
                    for="auto-sync"
                    class="ml-2 block text-sm text-gray-300"
                    >Enable automatic data synchronization</label
                  >
                </div>

                <div class="flex items-center" v-if="preferences.autoSync">
                  <label
                    for="sync-interval"
                    class="mr-2 block text-sm text-gray-400"
                    >Sync interval:</label
                  >
                  <select
                    id="sync-interval"
                    v-model="preferences.syncInterval"
                    class="bg-gray-700 px-3 py-1 rounded-lg focus:ring-2 focus:ring-cryo focus:outline-none"
                  >
                    <option value="5">5 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2"
                  >Notifications</label
                >

                <div class="flex items-center">
                  <input
                    id="notifications"
                    v-model="preferences.notifications"
                    type="checkbox"
                    class="h-4 w-4 bg-gray-700 border-gray-600 rounded focus:ring-cryo"
                  />
                  <label
                    for="notifications"
                    class="ml-2 block text-sm text-gray-300"
                    >Enable price alerts and activity notifications</label
                  >
                </div>
              </div>
            </div>

            <div class="mt-6 border-t border-gray-700 pt-6 flex justify-end">
              <button
                @click="savePreferences"
                class="bg-cryo hover:bg-opacity-80 text-dark font-medium rounded-lg px-4 py-2 text-sm transition-colors flex items-center"
              >
                <Save size="14" class="mr-2" />
                Save Preferences
              </button>
            </div>
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
