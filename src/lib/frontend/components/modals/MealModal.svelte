<script lang="ts">
  import type { MealType } from "#lib/frontend/services/db/schema/index.js";
  import { mealService } from "#lib/frontend/services/mealService.js";
  import type { ModalCallbacks, ModalMode } from "#lib/frontend/types.js";

  import GenericLoader from "../misc/GenericLoader.svelte";
  import GenericModal from "./GenericModal.svelte";

  interface Props extends ModalCallbacks {
    open: boolean;
    mode: ModalMode;
    meal: MealType | null;
  }

  const { open, mode, meal, onSubmit, onClose }: Props = $props();

  const title = $derived(mode === "create" ? "Cadastrar" : "Atualizar");
  const buttonTitle = $derived(mode === "create" ? "Cadastrar" : "Atualizar");

  let isSaving = $state(false);
  let formState = $state<MealType>({
    id: crypto.randomUUID(),
    name: "",
    calories: 0,
  });

  const disableSave = $derived.by(() => {
    return !formState.name || !formState.calories;
  });

  const resetForm = () => {
    formState = {
      id: crypto.randomUUID(),
      name: "",
      calories: 0,
    };
  };

  const buildMeal = (): MealType => {
    return $state.snapshot(formState);
  };

  const handleModalClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (isSaving || disableSave) return;

    isSaving = true;
    try {
      const meal = buildMeal();
      if (mode === "create") await mealService.createMeal(meal);
      else await mealService.updateMeal(meal);
      await onSubmit();
    } finally {
      isSaving = false;
    }
  };

  const handleDelete = async () => {
    if (!meal) return;
    isSaving = true;
    try {
      await mealService.deleteMeal(meal.id);
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
    <span>Nome da refeição</span>
    <input
      type="text"
      class="input input-bordered w-full"
      placeholder="Nome da refeição"
      bind:value={formState.name}
      disabled={isSaving} />
  </label>

  <label class="floating-label">
    <span>Calorias (kcal)</span>
    <input
      type="number"
      class="input input-bordered w-full"
      placeholder="Calorias (kcal)"
      bind:value={formState.calories}
      min="0"
      disabled={isSaving} />
  </label>

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
