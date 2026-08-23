<script lang="ts">
  import { db } from "#lib/frontend/services/db/index.js";
  import type { ModalCallbacks } from "#lib/frontend/types.js";

  import GenericLoader from "../misc/GenericLoader.svelte";
  import GenericModal from "./GenericModal.svelte";

  interface Props extends ModalCallbacks {
    open: boolean;
  }

  const { open, onSubmit, onClose }: Props = $props();

  let isClearing = $state(false);

  const handleModalClose = () => {
    if (isClearing) return;
    onClose();
  };

  const handleClear = async () => {
    if (isClearing) return;

    isClearing = true;
    try {
      await db.mealTypes.clear();
      await db.dailyMeals.clear();
      await db.weightRecords.clear();
      await db.settings.clear();
      await db.calorieRecords.clear();
      await onSubmit();
    } finally {
      isClearing = false;
    }
  };
</script>

<GenericModal
  title="Apagar todos os dados"
  {open}
  cantClose={isClearing}
  onClose={handleModalClose}>
  <p class="py-4 text-sm">
    Tem certeza que deseja apagar todos os seus dados? Esta ação não pode ser desfeita.
  </p>

  {#snippet modalActions()}
    <button
      class="btn btn-ghost"
      onclick={handleModalClose}
      disabled={isClearing}>Cancelar</button>
    <button
      class="btn btn-error"
      onclick={handleClear}
      disabled={isClearing}>
      {#if isClearing}<GenericLoader class="size-4" /> Apagando...{:else}Apagar{/if}
    </button>
  {/snippet}
</GenericModal>
