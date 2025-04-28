<template>
  <div>
    <div ref="lineChartContainer" :style="{width: width, height: height}"></div>
  </div>
</template>

<script>
import { onMounted, ref, onUnmounted, watch } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { cryodark } from './cryo-theme.js';

// Register necessary ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

export default {
  name: 'LineChart',
  props: {
    xAxisData: {
      type: Array,
      required: true,
      default: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    seriesData: {
      type: Array,
      required: true,
      default: () => [
        {
          name: 'Series 1',
          data: [150, 230, 224, 218, 135, 147, 260]
        },
        {
          name: 'Series 2',
          data: [80, 122, 190, 160, 90, 170, 200]
        }
      ]
    },
    title: {
      type: String,
      default: 'Line Chart'
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
      default: '400px'
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    showSymbol: {
      type: Boolean,
      default: true
    },
    smooth: {
      type: Boolean,
      default: true
    },
    areaStyle: {
      type: [Boolean, Object],
      default: false
    },
    xAxisName: {
      type: String,
      default: ''
    },
    yAxisName: {
      type: String,
      default: ''
    },
    showDataZoom: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const lineChartContainer = ref(null);
    let lineChart = null;

    const initChart = () => {
      if (lineChartContainer.value) {
        // Initialize with custom theme
        lineChart = echarts.init(lineChartContainer.value, 'cryodark');

        const options = {
          title: {
            text: props.title,
            subtext: props.subtitle,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            show: props.showLegend,
            data: props.seriesData.map(item => item.name),
            bottom: '0'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: props.showLegend ? '12%' : '3%',
            top: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.xAxisData,
            name: props.xAxisName,
            nameLocation: 'middle',
            nameGap: 30
          },
          yAxis: {
            type: 'value',
            name: props.yAxisName,
            nameLocation: 'middle',
            nameGap: 50
          },
          series: props.seriesData.map(item => ({
            name: item.name,
            type: 'line',
            data: item.data,
            smooth: props.smooth,
            showSymbol: props.showSymbol,
            areaStyle: props.areaStyle ? {
              opacity: 0.3
            } : null,
            emphasis: {
              focus: 'series'
            }
          }))
        };

        // Add data zoom component if requested
        if (props.showDataZoom) {
          options.dataZoom = [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100
            }
          ];
        }

        lineChart.setOption(options);

        // Handle resize
        window.addEventListener('resize', () => {
          lineChart?.resize();
        });
      }
    };

    // Watch for x-axis data changes
    watch(() => props.xAxisData, (newData) => {
      if (lineChart) {
        lineChart.setOption({
          xAxis: {
            data: newData
          }
        });
      }
    }, { deep: true });

    // Watch for series data changes
    watch(() => props.seriesData, (newSeries) => {
      if (lineChart) {
        const options = {
          legend: {
            data: newSeries.map(item => item.name)
          },
          series: newSeries.map(item => ({
            name: item.name,
            data: item.data,
            smooth: props.smooth,
            showSymbol: props.showSymbol,
            areaStyle: props.areaStyle ? {
              opacity: 0.3
            } : null
          }))
        };
        lineChart.setOption(options);
      }
    }, { deep: true });

    // Watch for title changes
    watch(() => [props.title, props.subtitle], ([newTitle, newSubtitle]) => {
      if (lineChart) {
        lineChart.setOption({
          title: {
            text: newTitle,
            subtext: newSubtitle
          }
        });
      }
    });

    // Watch for style changes
    watch(() => [props.smooth, props.showSymbol, props.areaStyle], ([newSmooth, newShowSymbol, newAreaStyle]) => {
      if (lineChart) {
        const series = props.seriesData.map(item => ({
          name: item.name,
          smooth: newSmooth,
          showSymbol: newShowSymbol,
          areaStyle: newAreaStyle ? {
            opacity: 0.3
          } : null
        }));
        lineChart.setOption({
          series: series
        });
      }
    });

    onMounted(() => {
      initChart();
    });

    onUnmounted(() => {
      lineChart?.dispose();
      window.removeEventListener('resize', lineChart?.resize);
    });

    return {
      lineChartContainer
    };
  }
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>