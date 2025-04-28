<template>
  <div>
    <div ref="pieChartContainer" style="width: 100% ; height: 300px"  ></div>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { cryodark } from './cryo-theme.js';

// Register necessary ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export default {
  name: 'PieChartComponent',
  props: {
    chartData: {
      type: Array,
      required: true,
      default: () => [
        { value: 335, name: 'Category 1' },
        { value: 310, name: 'Category 2' },
        { value: 234, name: 'Category 3' },
        { value: 135, name: 'Category 4' },
        { value: 154, name: 'Category 5' }
      ]
    },
    title: {
      type: String,
      default: 'Pie Chart'
    },
    subtitle: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    radius: {
      type: [String, Array],
      default: '60%'
    },
    center: {
      type: Array,
      default: () => ['50%', '50%']
    },
    roseType: {
      type: [Boolean, String],
      default: false
    }
  },
  setup(props) {
    const pieChartContainer = ref(null);
    let pieChart = null;

    const initChart = () => {
      if (pieChartContainer.value) {
        // Initialize with custom theme
        pieChart = echarts.init(pieChartContainer.value, 'cryodark');

        const options = {
          title: {
            text: props.title,
            subtext: props.subtitle,
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            show: props.showLegend,
            orient: 'horizontal',
            bottom: '0',
            data: props.chartData.map(item => item.name)
          },
          series: [
            {
              name: props.title,
              type: 'pie',
              radius: props.radius,
              center: props.center,
              roseType: props.roseType ? 'radius' : false,
              data: props.chartData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                show: true,
                formatter: '{b}: {d}%'
              },
              labelLine: {
                show: true
              }
            }
          ]
        };

        pieChart.setOption(options);

        // Handle resize
        window.addEventListener('resize', () => {
          pieChart?.resize();
        });
      }
    };

    // Watch for data changes to update chart
    watch(() => props.chartData, (newData) => {
      if (pieChart) {
        const options = {
          legend: {
            data: newData.map(item => item.name)
          },
          series: [
            {
              data: newData
            }
          ]
        };
        pieChart.setOption(options);
      }
    }, { deep: true });

    // Watch for title changes
    watch(() => [props.title, props.subtitle], ([newTitle, newSubtitle]) => {
      if (pieChart) {
        pieChart.setOption({
          title: {
            text: newTitle,
            subtext: newSubtitle
          },
          series: [
            {
              name: newTitle
            }
          ]
        });
      }
    });

    onMounted(() => {
      initChart();
    });

    onUnmounted(() => {
      pieChart?.dispose();
      window.removeEventListener('resize', pieChart?.resize);
    });

    return {
      pieChartContainer
    };
  }
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>