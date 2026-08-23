<script lang="ts">
  import type { Snippet } from "svelte";
  interface Props {
    title: string;
    subtitle?: string;
    actions?: Snippet;
  }
  let { title, subtitle, actions }: Props = $props();
</script>

<div class="mb-4 flex items-start justify-between gap-4">
  <div>
    <h1 class="text-2xl font-bold">{title}</h1>
    {#if subtitle}
      <p class="text-base-content/60 text-sm">{subtitle}</p>
    {/if}
  </div>
  {#if actions}
    <div class="shrink-0">{@render actions()}</div>
  {/if}
</div>
