<script lang="ts">
  import "./layout.css";
  import { onNavigate } from "$app/navigation";
  import { updated } from "$app/state";

  import Dock from "#lib/frontend/components/layout/Dock.svelte";
  import ToastRenderer from "#lib/frontend/components/ui/ToastRenderer.svelte";

  let { children } = $props();

  onNavigate((nav) => {
    if (nav.shallow) return;
    if (!document.startViewTransition) return;
    const { promise, resolve } = Promise.withResolvers<void>();
    document.startViewTransition(async () => {
      resolve();
      await nav.complete;
    });
    return promise;
  });
</script>

<svelte:head>
  <title>KCal Tracker</title>
  <link
    rel="icon"
    href="/favicon.svg" /></svelte:head>

<main class="container mx-auto p-4">
  <div class="mb-12">
    {@render children()}
  </div>
  <Dock />
</main>

{#if updated.current}
  <div class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform">
    <div class="alert alert-warning shadow">
      O site foi atualizado, por favor, recarregue a página!
    </div>
  </div>
{/if}

<ToastRenderer />
