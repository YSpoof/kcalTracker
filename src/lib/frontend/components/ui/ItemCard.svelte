<script lang="ts">
  import type { Snippet } from "svelte";
  import ChevronRightIcon from "~icons/mdi/chevron-right";
  interface Props {
    onclick?: () => void;
    leading?: Snippet;
    trailing?: Snippet;
    children: Snippet;
  }
  let { onclick, leading, trailing, children }: Props = $props();
</script>

<div
  class="card bg-base-100 dark:bg-base-300 cursor-pointer shadow-sm transition-shadow hover:shadow-md"
  role="button"
  tabindex="0"
  onkeydown={(e) => e.key === "Enter" && onclick?.()}
  {onclick}>
  <div class="card-body flex flex-row items-center gap-3 px-4 py-3">
    {#if leading}
      <div class="text-primary shrink-0">{@render leading()}</div>
    {/if}
    <div class="min-w-0 flex-1">{@render children()}</div>
    {#if trailing}
      {@render trailing()}
    {:else}
      <ChevronRightIcon class="text-base-content/30 size-5 shrink-0" />
    {/if}
  </div>
</div>
