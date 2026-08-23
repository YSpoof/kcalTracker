<script lang="ts">
  import { LineChart } from "echarts/charts";
  import { GridComponent, TooltipComponent, MarkLineComponent } from "echarts/components";
  import * as echarts from "echarts/core";
  import { SVGRenderer } from "echarts/renderers";

  import { formatNumber } from "#lib/frontend/utils/formatters.js";

  echarts.use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, SVGRenderer]);

  const GREEN = "#16a34a";
  const GRAY = "#9ca3af";

  interface Props {
    labels: string[];
    values: number[];
    target?: number;
  }

  let { labels = [], values = [], target }: Props = $props();

  function buildOption(): echarts.EChartsCoreOption {
    const lastIndex = values.length - 1;

    return {
      tooltip: {
        trigger: "axis",
        valueFormatter: (value: unknown) => `${formatNumber(value as number, 1)} kg`,
      },
      grid: {
        left: 8,
        right: 16,
        top: 24,
        bottom: 0,
        outerBoundsMode: "same",
        outerBoundsContain: "axisLabel",
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { color: GRAY, fontSize: 11, margin: 12 },
      },
      yAxis: {
        type: "value",
        scale: true,
        axisLabel: { color: GRAY, fontSize: 11 },
        splitLine: { show: false },
      },
      series: [
        {
          type: "line",
          data: values,
          smooth: 0.2,
          symbol: "circle",
          symbolSize: 7,
          itemStyle: { color: GREEN, borderColor: "#fff", borderWidth: 2 },
          lineStyle: { color: GREEN, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(22, 163, 74, 0.25)" },
              { offset: 1, color: "rgba(22, 163, 74, 0)" },
            ]),
          },
          label: {
            show: true,
            position: "top",
            distance: 8,
            color: "#6b7280",
            fontSize: 11,
            fontWeight: 600,
            formatter: (params: { value: unknown; dataIndex: number }) =>
              params.dataIndex === lastIndex
                ? `{last|${formatNumber(params.value as number, 1)}}`
                : formatNumber(params.value as number, 1),
            rich: {
              last: {
                backgroundColor: GREEN,
                color: "#fff",
                fontWeight: 700,
                borderRadius: 6,
                padding: [4, 8],
              },
            },
          },
          markLine:
            target === undefined
              ? undefined
              : {
                  silent: true,
                  symbol: "none",
                  animation: false,
                  label: { show: false },
                  lineStyle: { type: "dashed", color: "#d1d5db" },
                  data: [{ yAxis: target }],
                },
        },
      ],
    };
  }
</script>

<div
  class="h-56 w-full"
  {@attach (node) => {
    const chart = echarts.init(node, undefined, { renderer: "svg" });

    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(node);

    $effect(() => {
      chart.setOption(buildOption(), true);
    });

    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }}>
</div>
