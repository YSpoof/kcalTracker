<script lang="ts">
  import type { DailyMeal, MealType } from "#lib/frontend/services/db/schema/index.js";
  import { mealService } from "#lib/frontend/services/mealService.js";
  import type { ModalCallbacks, ModalMode } from "#lib/frontend/types.js";
  import { getToday } from "#lib/frontend/utils/date.js";

  import GenericLoader from "../misc/GenericLoader.svelte";
  import GenericModal from "./GenericModal.svelte";

  interface Props extends ModalCallbacks {
    open: boolean;
    mode: ModalMode;
    meal: DailyMeal | null;
    availableMeals: MealType[];
  }

  type SelectedMeal = MealType | "manual";

  const { open, mode, meal, availableMeals, onSubmit, onClose }: Props = $props();

  const title = $derived(mode === "create" ? "Registrar" : "Atualizar");
  const buttonTitle = $derived(mode === "create" ? "Registrar" : "Atualizar");

  let selectedMeal = $state<SelectedMeal>("manual");
  let isSaving = $state(false);
  let formState = $state<DailyMeal>({
    id: crypto.randomUUID(),
    date: getToday(),
    name: "",
    calories: 0,
  });

  const disableSave = $derived.by(() => {
    if (selectedMeal === "manual") {
      return !formState.name || !formState.calories;
    }
    return false;
  });

  const resetForm = () => {
    selectedMeal = "manual";
    formState = {
      id: crypto.randomUUID(),
      date: getToday(),
      name: "",
      calories: 0,
    };
  };

  const buildDailyMeal = (): DailyMeal => {
    if (selectedMeal === "manual") return $state.snapshot(formState);

    return {
      id: mode === "update" && meal ? meal.id : crypto.randomUUID(),
      date: mode === "update" && meal ? meal.date : getToday(),
      name: selectedMeal.name,
      calories: selectedMeal.calories,
    };
  };

  const handleModalClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (isSaving || disableSave) return;

    isSaving = true;
    try {
      const dailyMeal = buildDailyMeal();
      if (mode === "create") await mealService.createDailyMeal(dailyMeal);
      else await mealService.updateDailyMeal(dailyMeal);
      await onSubmit();
    } finally {
      isSaving = false;
    }
  };

  const handleDelete = async () => {
    if (!meal) return;
    isSaving = true;
    try {
      await mealService.deleteDailyMeal(meal.id);
      await onSubmit();
    } finally {
      isSaving = false;
    }
  };

  $effect(() => {
    if (!open) {
      setTimeout(() => {
        resetForm();
      }, 300);
      return;
    }

    if (mode === "update" && meal) {
      selectedMeal = "manual";
      formState = { ...meal };
      return;
    }

    setTimeout(() => {
      resetForm();
    }, 300);
  });
</script>

<GenericModal
  title={`${title} refeição`}
  {open}
  cantClose={isSaving}
  onClose={handleModalClose}>
  <label class="floating-label">
    <span>Refeição</span>
    <select
      bind:value={selectedMeal}
      class="select select-bordered w-full"
      disabled={isSaving}>
      {#each availableMeals as availableMeal (availableMeal.id)}
        <option value={availableMeal}>{availableMeal.name}</option>
      {/each}
      <option value="manual">Outro (manual)</option>
    </select>
  </label>
  {#if selectedMeal === "manual"}
    <label class="floating-label">
      <span>Nome da refeição</span>
      <input
        type="text"
        bind:value={formState.name}
        class="input input-bordered w-full"
        placeholder="Nome da refeição"
        disabled={isSaving} />
    </label>
    <label class="floating-label">
      <span>Calorias (kcal)</span>
      <input
        type="number"
        bind:value={formState.calories}
        class="input input-bordered w-full"
        placeholder="Calorias (kcal)"
        min="0"
        disabled={isSaving} />
    </label>
  {/if}

  {#snippet modalActions()}
    {#if mode === "update"}
      <button
        class="btn btn-ghost text-error mr-auto"
        type="button"
        onclick={handleDelete}
        disabled={isSaving}>
        Excluir
      </button>
    {/if}
    <button
      class="btn btn-ghost"
      type="button"
      disabled={isSaving}
      onclick={handleModalClose}>Cancelar</button>
    <button
      class="btn btn-primary"
      disabled={disableSave || isSaving}
      onclick={handleSubmit}
      type="submit">
      {#if isSaving}
        <GenericLoader class="size-4" />
        Salvando...
      {:else}
        {buttonTitle}
      {/if}
    </button>
  {/snippet}
</GenericModal>
