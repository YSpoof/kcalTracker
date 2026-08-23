<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    message: string;
    children?: Snippet;
  }
  let { message, children }: Props = $props();
</script>

<div class="card bg-base-200">
  <div class="card-body items-center gap-2 text-center">
    {#if children}
      {@render children?.()}
    {/if}
    <p class="text-base-content/50 text-sm">{message}</p>
  </div>
</div>
