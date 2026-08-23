<script lang="ts">
  import { onMount } from "svelte";
  import ChevronRightIcon from "~icons/mdi/chevron-right";
  import FoodDrumstickOffIcon from "~icons/mdi/food-drumstick-off-outline";
  import MagnifyIcon from "~icons/mdi/magnify";
  import PlusBoxIcon from "~icons/mdi/plus-box-outline";

  import MealModal from "#lib/frontend/components/modals/MealModal.svelte";
  import EmptyState from "#lib/frontend/components/ui/EmptyState.svelte";
  import ItemCard from "#lib/frontend/components/ui/ItemCard.svelte";
  import PageHeader from "#lib/frontend/components/ui/PageHeader.svelte";
  import type { MealType } from "#lib/frontend/services/db/schema/index.js";
  import { mealService } from "#lib/frontend/services/mealService.js";
  import type { ModalMode } from "#lib/frontend/types.js";
  import { formatNumber } from "#lib/frontend/utils/formatters.js";

  let meals = $state<MealType[]>([]);
  let search = $state("");
  let filteredMeals = $derived(
    meals.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())),
  );

  let modalOpen = $state(false);
  let modalMode = $state<ModalMode>("create");
  let editingMeal = $state<MealType | null>(null);

  const openModal = (mode: ModalMode, meal: MealType | null) => {
    modalMode = mode;
    editingMeal = meal;
    modalOpen = true;
  };

  const closeModal = () => {
    modalOpen = false;
    editingMeal = null;
  };

  const handleModalSubmit = async () => {
    await reloadMeals();
    closeModal();
  };

  const reloadMeals = async () => {
    meals = await mealService.getMeals();
  };

  onMount(async () => {
    await reloadMeals();
  });
</script>

<div class="space-y-4">
  <PageHeader
    title="Refeições"
    subtitle="Cadastre suas refeições para poder registrá-las no dia.">
    {#snippet actions()}
      <button
        class="btn btn-primary"
        onclick={() => openModal("create", null)}>
        <PlusBoxIcon class="size-6" />
      </button>
    {/snippet}
  </PageHeader>

  <label class="input w-full">
    <MagnifyIcon class="size-5 opacity-50" />
    <input
      type="search"
      class="grow"
      placeholder="Buscar refeição..."
      bind:value={search} />
  </label>

  <div class="space-y-2">
    {#each filteredMeals as meal (meal.id)}
      <ItemCard onclick={() => openModal("update", meal)}>
        <h2 class="card-title text-base font-bold">{meal.name}</h2>
        <p class="text-base-content/60 text-sm">{formatNumber(meal.calories)} KCal</p>
      </ItemCard>
    {:else}
      <EmptyState message="Nenhuma refeição cadastrada">
        <FoodDrumstickOffIcon class="size-6 opacity-40" />
      </EmptyState>
    {/each}
  </div>

  {#if filteredMeals.length > 0}
    <p class="text-base-content/40 text-center text-xs">
      Toque em uma refeição para editar ou excluí-la
    </p>
  {/if}
</div>

<MealModal
  open={modalOpen}
  mode={modalMode}
  meal={editingMeal}
  onSubmit={handleModalSubmit}
  onClose={closeModal} />
