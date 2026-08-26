<script lang="ts">
  import { BarChart } from "echarts/charts";
  import { GridComponent, TooltipComponent, MarkLineComponent } from "echarts/components";
  import * as echarts from "echarts/core";
  import { SVGRenderer } from "echarts/renderers";

  import { formatNumber } from "#lib/frontend/utils/formatters.js";

  echarts.use([BarChart, GridComponent, TooltipComponent, MarkLineComponent, SVGRenderer]);

  const GREEN = "#16a34a";
  const ORANGE = "#f5a623";
  const GRAY = "#9ca3af";
  const TODAY_BG = "rgba(22, 163, 74, 0.1)";

  interface Props {
    labels: string[];
    values: number[];
    target?: number;
    selectedIndex?: number;
    onSelect?: (index: number) => void;
  }

  let { labels = [], values = [], target, selectedIndex, onSelect }: Props = $props();

  const highlightIndex = $derived(
    selectedIndex !== undefined && selectedIndex >= 0 ? selectedIndex : labels.length - 1,
  );

  function buildOption(): echarts.EChartsCoreOption {
    return {
      tooltip: {
        trigger: "axis",
        valueFormatter: (value: unknown) => `${formatNumber(value as number)} kcal`,
      },
      grid: {
        left: 8,
        right: 8,
        top: 16,
        bottom: 0,
        outerBoundsMode: "same",
        outerBoundsContain: "axisLabel",
      },
      xAxis: {
        type: "category",
        data: labels,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          interval: 0,
          margin: 12,
          fontSize: 11,
          formatter: (label: string, index: number) => {
            const [weekday, day] = label.split("\n");
            return index === highlightIndex
              ? `{weekToday|${weekday}}\n{dayToday|${day}}`
              : `{week|${weekday}}\n{day|${day}}`;
          },
          rich: {
            week: { color: GRAY, padding: [0, 0, 6, 0] },
            day: { color: GRAY },
            weekToday: {
              color: GREEN,
              fontWeight: 600,
              backgroundColor: TODAY_BG,
              borderRadius: [4, 4, 0, 0],
              padding: [3, 6, 5, 6],
            },
            dayToday: {
              color: GREEN,
              fontWeight: 600,
              backgroundColor: TODAY_BG,
              borderRadius: [0, 0, 4, 4],
              padding: [0, 6, 3, 6],
            },
          },
        },
      },
      yAxis: {
        type: "value",
        show: false,
        max: ({ max: axisMax }: { max: number }) => Math.ceil(axisMax * 1.2),
      },
      series: [
        {
          type: "bar",
          data: values,
          barMaxWidth: 28,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: ({ value }: { value: unknown }) =>
              target !== undefined && (value as number) > target ? ORANGE : GREEN,
          },
          label: {
            show: true,
            position: "top",
            color: "#6b7280",
            fontSize: 11,
            fontWeight: 600,
            formatter: ({ value }: { value: unknown }) => formatNumber(value as number),
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

<div class={["relative h-56 w-full", onSelect && "cursor-pointer"]}>
  <div
    class="h-full w-full"
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
  {#if onSelect}
    <div class="absolute inset-0 z-10 flex">
      {#each labels as label, index (label)}
        <button
          type="button"
          class="h-full min-w-0 flex-1 cursor-pointer"
          aria-label={label.replace("\n", " ")}
          onclick={() => onSelect(index)}>
        </button>
      {/each}
    </div>
  {/if}
</div>
