<script setup lang="ts">
import { ref, computed } from "vue";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Search,
  ArrowUpDown,
  DollarSign,
  Percent,
} from "lucide-vue-next";

// Mock data for PnL demonstration
const pnlCoins = ref([
  {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    color: "#F7931A",
    costBasis: "34570.00",
    currentPrice: "38250.00",
    quantity: "1.45",
    totalCost: "50126.50",
    currentValue: "55462.50",
    pnl: "+5336.00",
    pnlPercent: "+10.64%",
    isProfit: true,
    performance: [40, 42, 38, 45, 35, 48, 50, 45],
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    color: "#627EEA",
    costBasis: "2140.00",
    currentPrice: "1850.62",
    quantity: "12.76",
    totalCost: "27306.40",
    currentValue: "23614.91",
    pnl: "-3691.49",
    pnlPercent: "-13.52%",
    isProfit: false,
    performance: [60, 58, 52, 48, 45, 40, 45, 42],
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    icon: "$",
    color: "#2775CA",
    costBasis: "1.00",
    currentPrice: "1.00",
    quantity: "5000.00",
    totalCost: "5000.00",
    currentValue: "5000.00",
    pnl: "0.00",
    pnlPercent: "0.00%",
    isProfit: true,
    performance: [50, 50, 50, 50, 50, 50, 50, 50],
  },
  {
    name: "Cardano",
    symbol: "ADA",
    icon: "₳",
    color: "#0033AD",
    costBasis: "0.42",
    currentPrice: "0.31",
    quantity: "12500.56",
    totalCost: "5250.23",
    currentValue: "3875.23",
    pnl: "-1375.00",
    pnlPercent: "-26.19%",
    isProfit: false,
    performance: [62, 58, 50, 45, 40, 35, 32, 30],
  },
  {
    name: "Solana",
    symbol: "SOL",
    icon: "◎",
    color: "#14F195",
    costBasis: "58.23",
    currentPrice: "75.01",
    quantity: "62.35",
    totalCost: "3630.65",
    currentValue: "4677.00",
    pnl: "+1046.35",
    pnlPercent: "+28.82%",
    isProfit: true,
    performance: [35, 38, 40, 45, 50, 55, 65, 70],
  },
]);

// Summary calculations
const totalPnL = computed(() => {
  const value = pnlCoins.value.reduce((sum, coin) => {
    const pnlValue =
      parseFloat(coin.pnl.replace("+", "").replace("-", "")) *
      (coin.isProfit ? 1 : -1);
    return sum + pnlValue;
  }, 0);
  return value.toFixed(2);
});

const isOverallProfit = computed(() => {
  return parseFloat(totalPnL.value) >= 0;
});

const totalInvestment = computed(() => {
  return pnlCoins.value
    .reduce((sum, coin) => sum + parseFloat(coin.totalCost), 0)
    .toFixed(2);
});

const totalPercentage = computed(() => {
  const percent =
    (parseFloat(totalPnL.value) / parseFloat(totalInvestment.value)) * 100;
  return percent.toFixed(2);
});

const timeRanges = ["24h", "7d", "30d", "90d", "1y", "All Time"];
const selectedTimeRange = ref("All Time");

const searchQuery = ref("");
const filteredCoins = computed(() => {
  if (!searchQuery.value) return pnlCoins.value;

  const query = searchQuery.value.toLowerCase();
  return pnlCoins.value.filter(
    (coin) =>
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
  );
});

const sortOptions = [
  "Name",
  "Highest P&L",
  "Lowest P&L",
  "Highest %",
  "Lowest %",
];
const selectedSort = ref("Highest P&L");

// Simplified mini chart component
const miniChart = (values: number[], color: string, height: number = 30) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = ((max - value) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" />`;
};
</script>

<template>
  <div class="min-h-screen text-white bg-gradient-to-b from-dark to-gray-800 px-4 !pt-19 py-12 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-cryo mb-2">
          Profit & Loss
        </h1>
        <p class="text-gray-300 mb-8">
          Track performance and returns for each asset
        </p>

        <!-- Overall P&L Card -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold flex items-center">
              <DollarSign class="mr-2 text-cryo" size="24" />
              Overall P&L Summary
            </h2>

            <!-- Time range selector -->
            <div class="flex bg-gray-700 rounded-lg">
              <button
                v-for="(range, index) in timeRanges"
                :key="index"
                @click="selectedTimeRange = range"
                class="px-3 py-1 text-xs transition-colors"
                :class="
                  selectedTimeRange === range
                    ? 'bg-gray-600 rounded-lg text-white'
                    : 'text-gray-400 hover:text-white'
                "
              >
                {{ range }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="border border-gray-700 rounded-lg p-4">
              <div class="text-gray-400 mb-1">Total P&L</div>
              <div class="flex items-center">
                <span
                  :class="isOverallProfit ? 'text-green-400' : 'text-red-400'"
                  class="text-2xl font-bold"
                >
                  {{ isOverallProfit ? "+" : "" }}${{ totalPnL }}
                </span>
                <span
                  :class="isOverallProfit ? 'text-green-400' : 'text-red-400'"
                  class="ml-2 text-sm"
                >
                  ({{ isOverallProfit ? "+" : "" }}{{ totalPercentage }}%)
                </span>
              </div>
            </div>

            <div class="border border-gray-700 rounded-lg p-4">
              <div class="text-gray-400 mb-1">Total Investment</div>
              <div class="text-2xl font-bold">${{ totalInvestment }}</div>
            </div>

            <div class="border border-gray-700 rounded-lg p-4">
              <div class="text-gray-400 mb-1">Best Performing Asset</div>
              <div class="text-lg font-medium">
                {{
                  pnlCoins.reduce(
                    (best, coin) =>
                      parseFloat(best.pnlPercent) >
                      parseFloat(
                        coin.pnlPercent.replace("+", "").replace("%", "")
                      )
                        ? best
                        : coin,
                    { name: "", pnlPercent: "-100%" }
                  ).name
                }}
                <span class="text-green-400">
                  {{
                    pnlCoins.reduce(
                      (best, coin) =>
                        parseFloat(best.pnlPercent) >
                        parseFloat(
                          coin.pnlPercent.replace("+", "").replace("%", "")
                        )
                          ? best
                          : coin,
                      { name: "", pnlPercent: "-100%" }
                    ).pnlPercent
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- P&L Table -->
        <div
          class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700"
        >
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
          >
            <h2 class="text-xl font-bold">P&L by Asset</h2>

            <div class="flex items-center gap-4 w-full sm:w-auto">
              <!-- Search -->
              <div class="relative flex-grow sm:flex-grow-0 w-full sm:w-auto">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search assets"
                  class="bg-gray-700 rounded-lg py-2 pl-9 pr-4 w-full sm:w-64 text-sm"
                />
                <Search
                  size="16"
                  class="absolute left-3 top-2.5 text-gray-400"
                />
              </div>

              <!-- Sort -->
              <div class="relative">
                <button
                  class="flex items-center bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <ArrowUpDown size="16" class="mr-2" />
                  {{ selectedSort }}
                </button>
              </div>
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
                    Quantity
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    Avg. Cost
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    Current Price
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    P&L ($)
                  </th>
                  <th class="text-right py-3 px-2 text-sm text-gray-400">
                    P&L (%)
                  </th>
                  <th class="text-center py-3 px-2 text-sm text-gray-400">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(coin, index) in filteredCoins"
                  :key="index"
                  class="border-b border-gray-700 hover:bg-gray-700/30"
                >
                  <td class="py-4 px-2">
                    <div class="flex items-center">
                      <div
                        class="h-8 w-8 rounded-full mr-3 flex items-center justify-center"
                        :style="{ backgroundColor: coin.color }"
                      >
                        <span class="text-sm">{{ coin.icon }}</span>
                      </div>
                      <div>
                        <div class="font-medium">{{ coin.name }}</div>
                        <div class="text-sm text-gray-400">
                          {{ coin.symbol }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span>{{ coin.quantity }}</span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span>${{ coin.costBasis }}</span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span>${{ coin.currentPrice }}</span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span
                      :class="coin.isProfit ? 'text-green-400' : 'text-red-400'"
                    >
                      {{ coin.pnl }}
                    </span>
                  </td>
                  <td class="py-4 px-2 text-right">
                    <span
                      :class="coin.isProfit ? 'text-green-400' : 'text-red-400'"
                    >
                      {{ coin.pnlPercent }}
                    </span>
                  </td>
                  <td class="py-4 px-2">
                    <div class="h-8 w-24 mx-auto">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 30"
                        preserveAspectRatio="none"
                        v-html="
                          miniChart(
                            coin.performance,
                            coin.isProfit ? '#10B981' : '#EF4444'
                          )
                        "
                      ></svg>
                    </div>
                  </td>
                </tr>
                <tr
                  v-if="filteredCoins.length === 0"
                  class="border-b border-gray-700"
                >
                  <td colspan="7" class="py-4 px-2 text-center text-gray-400">
                    No assets found matching your search.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tax Implications Note -->
        <div
          class="bg-gray-800/50 rounded-lg p-4 mt-6 border border-gray-700/50 text-sm text-gray-400"
        >
          <p>
            <strong>Note:</strong> This P&L view is for informational purposes
            only and does not constitute financial or tax advice. Please consult
            with a financial advisor for tax implications on your cryptocurrency
            gains or losses.
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
