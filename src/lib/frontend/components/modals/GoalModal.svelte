<script lang="ts">
  import { settingsService } from "#lib/frontend/services/settingsService.js";
  import type { GoalKey, ModalCallbacks } from "#lib/frontend/types.js";

  import GenericLoader from "../misc/GenericLoader.svelte";
  import GenericModal from "./GenericModal.svelte";

  interface Props extends ModalCallbacks {
    open: boolean;
    goalKey: GoalKey | null;
    initialValue: number;
  }

  const { open, goalKey, initialValue, onSubmit, onClose }: Props = $props();

  let editValue = $state(0);
  let isSaving = $state(false);

  const title = $derived(goalKey === "calorie" ? "Meta de Calorias" : "Meta de Peso");
  const label = $derived(goalKey === "calorie" ? "Calorias (kcal)" : "Peso (kg)");

  const handleModalClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (isSaving || !goalKey) return;

    isSaving = true;
    try {
      if (goalKey === "calorie") await settingsService.setCalorieGoal(editValue);
      else await settingsService.setWeightGoal(editValue);
      await onSubmit();
    } finally {
      isSaving = false;
    }
  };

  $effect(() => {
    if (!open) return;
    editValue = initialValue;
  });
</script>

<GenericModal
  {title}
  {open}
  cantClose={isSaving}
  onClose={handleModalClose}>
  <label class="floating-label">
    <span>{label}</span>
    <input
      type="number"
      class="input input-bordered w-full"
      placeholder={label}
      bind:value={editValue}
      disabled={isSaving} />
  </label>

  {#snippet modalActions()}
    <button
      class="btn btn-ghost"
      onclick={handleModalClose}
      disabled={isSaving}>Cancelar</button>
    <button
      class="btn btn-primary"
      onclick={handleSubmit}
      disabled={isSaving}>
      {#if isSaving}<GenericLoader class="size-4" /> Salvando...{:else}Salvar{/if}
    </button>
  {/snippet}
</GenericModal>
