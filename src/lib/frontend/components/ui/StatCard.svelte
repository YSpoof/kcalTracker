<script lang="ts">
  import type { Component } from "svelte";
  interface Props {
    Icon: Component;
    value: string;
    label: string;
    valueClass?: string;
    iconClass?: string;
    iconBgClass?: string;
  }
  let { Icon, value, label, valueClass = "", iconClass = "", iconBgClass = "" }: Props = $props();
</script>

<div class="flex flex-col items-center gap-1">
  <div class={`flex size-8 items-center justify-center rounded-full ${iconBgClass}`}>
    <Icon class={`size-5 ${iconClass}`} />
  </div>
  <p class={`text-lg font-bold ${valueClass}`}>{value}</p>
  <p class="text-base-content/60 text-xs">{label}</p>
</div>
