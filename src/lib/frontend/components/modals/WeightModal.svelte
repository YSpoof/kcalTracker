<script lang="ts">
  import type { WeightRecord } from "#lib/frontend/services/db/schema/weight.schema.js";
  import { weightService } from "#lib/frontend/services/weigthService.js";
  import type { ModalCallbacks, ModalMode } from "#lib/frontend/types.js";
  import { getToday } from "#lib/frontend/utils/date.js";

  import GenericLoader from "../misc/GenericLoader.svelte";
  import GenericModal from "./GenericModal.svelte";

  interface Props extends ModalCallbacks {
    open: boolean;
    mode: ModalMode;
    weight: WeightRecord | null;
  }

  const { open, mode, weight, onSubmit, onClose }: Props = $props();

  let weightValue = $state<number>(0);
  let dateValue = $state(getToday());
  let maxDate = $state(getToday());
  let isSaving = $state(false);

  const title = $derived(mode === "create" ? "Registrar peso" : "Atualizar peso");
  const buttonTitle = $derived(mode === "create" ? "Registrar" : "Atualizar");
  const disableSave = $derived(!weightValue || isSaving || (mode === "create" && !dateValue));

  const handleSubmit = async () => {
    if (disableSave) return;
    if (mode === "create" && dateValue > maxDate) return;
    isSaving = true;
    try {
      const record: WeightRecord = {
        id: mode === "update" && weight ? weight.id : crypto.randomUUID(),
        date: mode === "update" && weight ? weight.date : dateValue,
        weight: weightValue,
      };
      if (mode === "create") await weightService.createWeight(record);
      else await weightService.updateWeight(record);
      await onSubmit();
    } finally {
      isSaving = false;
    }
  };

  const handleDelete = async () => {
    if (!weight) return;
    isSaving = true;
    try {
      await weightService.deleteWeight(weight.id);
      await onSubmit();
    } finally {
      isSaving = false;
    }
  };

  $effect(() => {
    if (!open) {
      weightValue = 0;
      dateValue = getToday();
      return;
    }
    maxDate = getToday();
    if (mode === "update" && weight) {
      weightValue = weight.weight;
      return;
    }
    dateValue = getToday();
  });
</script>

<GenericModal
  {title}
  {open}
  cantClose={isSaving}
  {onClose}>
  {#if mode === "create"}
    <label class="floating-label">
      <span>Data</span>
      <input
        type="date"
        class="input input-bordered w-full"
        bind:value={dateValue}
        max={maxDate}
        disabled={isSaving} />
    </label>
  {/if}
  <label class="floating-label">
    <span>Peso (kg)</span>
    <input
      type="number"
      class="input input-bordered w-full"
      inputmode="decimal"
      pattern="\d+(\.\d+)?"
      placeholder="Peso (kg)"
      min="0"
      step="0.1"
      bind:value={weightValue}
      disabled={isSaving} />
  </label>

  {#snippet modalActions()}
    {#if mode === "update"}
      <button
        class="btn btn-ghost text-error mr-auto"
        onclick={handleDelete}
        disabled={isSaving}>
        Excluir
      </button>
    {/if}
    <button
      class="btn btn-ghost"
      onclick={onClose}
      disabled={isSaving}>Cancelar</button>
    <button
      class="btn btn-primary"
      disabled={disableSave}
      onclick={handleSubmit}>
      {#if isSaving}<GenericLoader class="size-4" /> Salvando...{:else}{buttonTitle}{/if}
    </button>
  {/snippet}
</GenericModal>
