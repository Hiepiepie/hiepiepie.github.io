<template>
  <div ref="chartRef" :style="{ width: '100%', height: '400px' }"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {cryodark} from "./cryo-theme.js";

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer
]);

export default {
  name: 'StackedLineChart',
  props: {
    data: {
      type: Array,
      default: () => [
        // Default sample data if none provided
        { date: '2023-01', category1: 120, category2: 80, category3: 60 },
        { date: '2023-02', category1: 132, category2: 89, category3: 70 },
        { date: '2023-03', category1: 101, category2: 120, category3: 90 },
        { date: '2023-04', category1: 134, category2: 130, category3: 85 },
        { date: '2023-05', category1: 90, category2: 110, category3: 95 },
        { date: '2023-06', category1: 230, category2: 180, category3: 120 }
      ]
    },
    chartTitle: {
      type: String,
      default: 'Stacked Line Chart'
    }
  },
  setup(props) {
    const chartRef = ref(null);
    let chart = null;

    // Initialize chart
    const initChart = () => {
      if (chartRef.value) {
        chart = echarts.init(chartRef.value, 'cryodark');
        updateChart();
      }
    };

    // Update chart with data
    const updateChart = () => {
      if (!chart) return;

      const categories = Object.keys(props.data[0]).filter(key => key !== 'date');

      const option = {
        title: {
          text: props.chartTitle,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#414868'
            }
          }
        },
        legend: {
          data: categories,
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: props.data.map(item => item.date)
        },
        yAxis: {
          type: 'value'
        },
        series: categories.map(category => ({
          name: category,
          type: 'line',
          stack: 'Total',
          areaStyle: {
            opacity: 0.6
          },
          emphasis: {
            focus: 'series'
          },
          data: props.data.map(item => item[category])
        }))
      };

      chart.setOption(option);
    };

    // Handle window resize
    const handleResize = () => {
      chart && chart.resize();
    };

    onMounted(() => {
      initChart();
      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      if (chart) {
        chart.dispose();
        chart = null;
      }
      window.removeEventListener('resize', handleResize);
    });

    return {
      chartRef
    };
  }
};
</script>