<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Search,
  Eye,
  Clock,
  AlertCircle,
  Trash2,
  Plus,
  ArrowUpRight,
  BarChart2,
} from "lucide-vue-next";

// Tracked whale wallets
const trackedWhales = ref([
  {
    id: 1,
    name: "ETH Whale #1",
    address: "0x28c6c06298d514db089934071355e5743bf21d60",
    shortAddress: "0x28c6...1d60",
    network: "Ethereum",
    lastActivity: "2 hours ago",
    totalValue: "245,892,350",
    topHoldings: [
      {
        symbol: "ETH",
        name: "Ethereum",
        amount: "53,400",
        value: "98,790,000",
        percent: 40.2,
      },
      {
        symbol: "USDT",
        name: "Tether",
        amount: "42,500,000",
        value: "42,500,000",
        percent: 17.3,
      },
      {
        symbol: "LINK",
        name: "Chainlink",
        amount: "3,265,000",
        value: "32,650,000",
        percent: 13.3,
      },
    ],
    recentTransactions: [
      {
        type: "Swap",
        amount: "5,000 ETH → 5,450,000 USDT",
        time: "3 hours ago",
      },
      { type: "Transfer Out", amount: "450,000 USDT", time: "3 hours ago" },
      { type: "Transfer In", amount: "2,800 ETH", time: "2 days ago" },
    ],
    isWatching: true,
  },
  {
    id: 2,
    name: "Bitcoin Whale",
    address: "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h",
    shortAddress: "bc1qm3...7s3h",
    network: "Bitcoin",
    lastActivity: "1 day ago",
    totalValue: "173,456,250",
    topHoldings: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        amount: "4,512",
        value: "173,456,250",
        percent: 100,
      },
    ],
    recentTransactions: [
      { type: "Transfer Out", amount: "250 BTC", time: "1 day ago" },
      { type: "Transfer In", amount: "520 BTC", time: "5 days ago" },
      { type: "Transfer Out", amount: "125 BTC", time: "2 weeks ago" },
    ],
    isWatching: true,
  },
  {
    id: 3,
    name: "Solana Whale",
    address: "FZLPdpCR3Jpyoz2kViG9nhJyHxhLZcw7Ymdo7ncHvjK7",
    shortAddress: "FZLPd...vjK7",
    network: "Solana",
    lastActivity: "5 hours ago",
    totalValue: "32,589,700",
    topHoldings: [
      {
        symbol: "SOL",
        name: "Solana",
        amount: "283,650",
        value: "21,273,750",
        percent: 65.3,
      },
      {
        symbol: "BONK",
        name: "Bonk",
        amount: "242,175,000,000",
        value: "6,054,375",
        percent: 18.6,
      },
      {
        symbol: "JTO",
        name: "Jito",
        amount: "675,400",
        value: "5,261,575",
        percent: 16.1,
      },
    ],
    recentTransactions: [
      {
        type: "Swap",
        amount: "12,000 SOL → 72,000,000,000 BONK",
        time: "5 hours ago",
      },
      { type: "Transfer In", amount: "85,000 SOL", time: "2 days ago" },
      { type: "Swap", amount: "5,000 SOL → 135,000 JTO", time: "4 days ago" },
    ],
    isWatching: true,
  },
]);

// Form for adding new whale address
const newWhale = ref({
  name: "",
  address: "",
  network: "Ethereum",
});

const networks = [
  "Ethereum",
  "Bitcoin",
  "Solana",
  "Binance Smart Chain",
  "Polygon",
];
const isAddingNew = ref(false);

// Search functionality
const searchQuery = ref("");
const filteredWhales = computed(() => {
  if (!searchQuery.value) return trackedWhales.value;

  const query = searchQuery.value.toLowerCase();
  return trackedWhales.value.filter(
    (whale) =>
      whale.name.toLowerCase().includes(query) ||
      whale.address.toLowerCase().includes(query) ||
      whale.network.toLowerCase().includes(query)
  );
});

// Toggle watching status
const toggleWatchStatus = (id: number) => {
  const whale = trackedWhales.value.find((w) => w.id === id);
  if (whale) {
    whale.isWatching = !whale.isWatching;
  }
};

// Delete tracked whale
const deleteTrackedWhale = (id: number) => {
  trackedWhales.value = trackedWhales.value.filter((w) => w.id !== id);
};

// Toggle add new form
const toggleAddNew = () => {
  isAddingNew.value = !isAddingNew.value;
  if (isAddingNew.value === false) {
    // Reset form when closing
    newWhale.value = {
      name: "",
      address: "",
      network: "Ethereum",
    };
  }
};

// Add new whale address
const addWhaleAddress = () => {
  // In a real app, this would validate the address and fetch data from an API
  const newId = Math.max(...trackedWhales.value.map((w) => w.id)) + 1;

  trackedWhales.value.push({
    id: newId,
    name: newWhale.value.name || `${newWhale.value.network} Whale #${newId}`,
    address: newWhale.value.address,
    shortAddress: `${newWhale.value.address.substring(
      0,
      6
    )}...${newWhale.value.address.substring(
      newWhale.value.address.length - 4
    )}`,
    network: newWhale.value.network,
    lastActivity: "Just added",
    totalValue: "0",
    topHoldings: [],
    recentTransactions: [],
    isWatching: true,
  });

  // Reset and close form
  toggleAddNew();
};

const selectedWhale = ref(null);

const selectWhale = (whale) => {
  selectedWhale.value = whale;
};
</script>

<template>
  <div class="min-h-screen text-white bg-gradient-to-b from-dark to-gray-800 px-4 !pt-19 py-12 sm:px-6 lg:px-8">

  <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-cryo mb-2">
          WhaleWatch
        </h1>
        <p class="text-gray-300 mb-8">
          Monitor large wallet holders and their trading activities
        </p>

        <!-- WhaleWatch Controls -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div class="flex items-center">
              <BarChart2 class="mr-2 text-cryo" size="24" />
              <h2 class="text-xl font-bold">Tracked Whales</h2>
            </div>

            <div class="flex items-center gap-4 w-full sm:w-auto">
              <!-- Search -->
              <div class="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by name, address or network"
                  class="bg-gray-700 rounded-lg py-2 pl-9 pr-4 w-full sm:w-64 text-sm"
                />
                <Search
                  size="16"
                  class="absolute left-3 top-2.5 text-gray-400"
                />
              </div>

              <!-- Add New Button -->
              <button
                @click="toggleAddNew"
                class="bg-cryo hover:bg-opacity-80 text-dark font-medium rounded-lg px-4 py-2 text-sm flex items-center transition-colors"
              >
                <Plus size="16" class="mr-1" />
                {{ isAddingNew ? "Cancel" : "Add Whale" }}
              </button>
            </div>
          </div>

          <!-- Add New Form -->
          <div
            v-if="isAddingNew"
            class="mb-6 bg-gray-700/50 p-4 rounded-lg border border-gray-600"
          >
            <h3 class="text-lg font-medium mb-4">Add New Whale Address</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >Nickname (Optional)</label
                >
                <input
                  v-model="newWhale.name"
                  type="text"
                  placeholder="E.g. Bitcoin Whale #1"
                  class="bg-gray-700 rounded-lg py-2 px-3 w-full"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >Blockchain</label
                >
                <select
                  v-model="newWhale.network"
                  class="bg-gray-700 rounded-lg py-2 px-3 w-full"
                >
                  <option
                    v-for="network in networks"
                    :key="network"
                    :value="network"
                  >
                    {{ network }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1"
                  >Wallet Address</label
                >
                <input
                  v-model="newWhale.address"
                  type="text"
                  placeholder="Enter wallet address"
                  class="bg-gray-700 rounded-lg py-2 px-3 w-full"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                @click="addWhaleAddress"
                :disabled="!newWhale.address"
                class="bg-cryo hover:bg-opacity-80 disabled:bg-opacity-50 disabled:cursor-not-allowed text-dark font-medium rounded-lg px-4 py-2 text-sm transition-colors"
              >
                Add Address
              </button>
            </div>
          </div>

          <!-- Whales Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="whale in filteredWhales"
              :key="whale.id"
              @click="selectWhale(whale)"
              class="border border-gray-700 rounded-lg p-4 hover:border-cryo transition-colors cursor-pointer"
              :class="
                selectedWhale === whale ? 'border-cryo bg-gray-700/30' : ''
              "
            >
              <div class="flex justify-between mb-2">
                <h3 class="font-medium">{{ whale.name }}</h3>
                <div class="flex items-center">
                  <button
                    @click.stop="toggleWatchStatus(whale.id)"
                    class="p-1 hover:text-cryo"
                  >
                    <Eye
                      size="16"
                      :class="whale.isWatching ? 'text-cryo' : 'text-gray-400'"
                    />
                  </button>
                  <button
                    @click.stop="deleteTrackedWhale(whale.id)"
                    class="p-1 hover:text-red-400"
                  >
                    <Trash2 size="16" />
                  </button>
                </div>
              </div>

              <div class="text-xs text-gray-400 mb-3 flex items-center">
                <span class="mr-2">{{ whale.shortAddress }}</span>
                <button class="hover:text-cryo">
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

              <div class="flex items-center text-xs mb-3">
                <span class="px-2 py-1 bg-gray-700 rounded-full">{{
                  whale.network
                }}</span>
                <span class="ml-2 flex items-center text-gray-400">
                  <Clock size="12" class="mr-1" />
                  {{ whale.lastActivity }}
                </span>
              </div>

              <div>
                <div class="text-gray-400 text-xs mb-1">Total Value</div>
                <div class="text-xl font-medium">${{ whale.totalValue }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Whale Details -->
        <div
          v-if="selectedWhale"
          class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
        >
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-xl font-bold">{{ selectedWhale.name }}</h2>
              <div class="text-sm text-gray-400 mt-1">
                {{ selectedWhale.address }}
              </div>
            </div>

            <a
              href="#"
              class="text-xs text-cryo hover:underline flex items-center"
            >
              View on Explorer
              <ArrowUpRight size="12" class="ml-1" />
            </a>
          </div>

          <!-- Top Holdings -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Top Holdings</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-700">
                    <th class="text-left py-2 px-2 text-sm text-gray-400">
                      Asset
                    </th>
                    <th class="text-right py-2 px-2 text-sm text-gray-400">
                      Amount
                    </th>
                    <th class="text-right py-2 px-2 text-sm text-gray-400">
                      Value (USD)
                    </th>
                    <th class="text-right py-2 px-2 text-sm text-gray-400">
                      % of Holdings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(holding, index) in selectedWhale.topHoldings"
                    :key="index"
                    class="border-b border-gray-700"
                  >
                    <td class="py-3 px-2">
                      <div class="flex items-center">
                        <div class="font-medium">{{ holding.name }}</div>
                        <div class="text-xs text-gray-400 ml-2">
                          {{ holding.symbol }}
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-2 text-right">{{ holding.amount }}</td>
                    <td class="py-3 px-2 text-right">${{ holding.value }}</td>
                    <td class="py-3 px-2 text-right">
                      <div class="flex items-center justify-end">
                        <div class="w-16 bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            class="bg-cryo h-2 rounded-full"
                            :style="{ width: `${holding.percent}%` }"
                          ></div>
                        </div>
                        {{ holding.percent }}%
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Transactions -->
          <div>
            <h3 class="text-lg font-medium mb-4">Recent Transactions</h3>
            <div class="space-y-4">
              <div
                v-for="(tx, index) in selectedWhale.recentTransactions"
                :key="index"
                class="flex justify-between border-b border-gray-700 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <div class="font-medium">{{ tx.type }}</div>
                  <div class="text-sm text-gray-400">{{ tx.time }}</div>
                </div>
                <div class="text-right">
                  <div>{{ tx.amount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!isAddingNew"
          class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 text-center"
        >
          <AlertCircle size="48" class="mx-auto mb-4 text-gray-400" />
          <h3 class="text-lg font-medium mb-2">
            Select a whale to view details
          </h3>
          <p class="text-gray-400">
            Click on any whale address above to view their holdings and
            transactions
          </p>
        </div>

        <!-- Info Alert -->
        <div
          class="bg-gray-800/50 rounded-lg p-4 mt-6 border border-gray-700/50 text-sm text-gray-400"
        >
          <p>
            <strong>Note:</strong> WhaleWatch monitors publicly available
            blockchain data. All transactions on public blockchains are visible
            to everyone. For educational purposes only.
          </p>
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
