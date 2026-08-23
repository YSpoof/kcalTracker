<script lang="ts">
  import { page } from "$app/state";
  import CogIcon from "~icons/mdi/cog-outline";
  import FoodIcon from "~icons/mdi/food-outline";
  import HomeIcon from "~icons/mdi/home-outline";
  import WeightIcon from "~icons/mdi/weight-kilogram";
  const currentPage = $derived(page.url.pathname);

  const routeMap = [
    {
      name: "Home",
      url: "/",
      Icon: HomeIcon,
    },
    {
      name: "Refeições",
      url: "/meals/",
      Icon: FoodIcon,
    },
    {
      name: "Peso",
      url: "/weight/",
      Icon: WeightIcon,
    },
    {
      name: "Config.",
      url: "/settings/",
      Icon: CogIcon,
    },
  ];
</script>

<div class="dock dock-xs">
  {#each routeMap as route}
    {const active = $derived(currentPage === route.url)}
    <a
      href={route.url}
      class:dock-active={active}>
      <route.Icon class="size-5" />
      {#if active}
        <span class="dock-label">{route.name}</span>
      {/if}
    </a>
  {/each}
</div>
