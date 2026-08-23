<script lang="ts">
  import { backupService, type BackupPayload } from "#lib/frontend/services/backupService.js";
  import { toastStore } from "#lib/frontend/stores/toast.svelte.js";
  import type { ModalCallbacks } from "#lib/frontend/types.js";

  import GenericLoader from "../misc/GenericLoader.svelte";
  import GenericModal from "./GenericModal.svelte";

  interface Props extends ModalCallbacks {
    open: boolean;
  }

  const { open, onSubmit, onClose }: Props = $props();

  let restoreFileInput = $state<HTMLInputElement>();
  let selectedRestoreFile = $state<File | null>(null);
  let parsedBackup = $state<BackupPayload | null>(null);
  let restoreError = $state<string | null>(null);
  let isRestoring = $state(false);

  let canRestore = $derived(parsedBackup !== null && restoreError === null);

  const resetForm = () => {
    selectedRestoreFile = null;
    parsedBackup = null;
    restoreError = null;
    if (restoreFileInput) restoreFileInput.value = "";
  };

  const handleModalClose = () => {
    if (isRestoring) return;
    onClose();
  };

  const handleRestoreFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    selectedRestoreFile = file;
    parsedBackup = null;
    restoreError = null;

    if (!file) return;

    try {
      parsedBackup = backupService.parseBackup(await file.text());
    } catch (error) {
      restoreError = error instanceof Error ? error.message : "Arquivo inválido.";
    }
  };

  const handleRestore = async () => {
    if (!parsedBackup || isRestoring) return;

    isRestoring = true;
    try {
      await backupService.restoreBackup(parsedBackup);
      await onSubmit();
    } catch {
      toastStore.showToast("Não foi possível restaurar o backup.", "error");
    } finally {
      isRestoring = false;
    }
  };

  $effect(() => {
    if (!open) resetForm();
  });
</script>

<GenericModal
  title="Restaurar dados"
  {open}
  cantClose={isRestoring}
  onClose={handleModalClose}>
  <p class="text-sm">
    Seus dados atuais serão substituídos pelos dados do backup. Esta ação não pode ser desfeita.
  </p>
  <label class="flex w-full flex-col gap-2">
    <span class="text-sm font-medium">Arquivo de backup</span>
    <input
      bind:this={restoreFileInput}
      type="file"
      accept="application/json,.json"
      class="file-input file-input-bordered w-full"
      onchange={handleRestoreFileSelect}
      disabled={isRestoring} />
  </label>
  {#if restoreError}
    <p class="text-error text-sm">{restoreError}</p>
  {/if}

  {#snippet modalActions()}
    <button
      class="btn btn-ghost"
      onclick={handleModalClose}
      disabled={isRestoring}>Cancelar</button>
    <button
      class="btn btn-primary"
      onclick={handleRestore}
      disabled={!canRestore || isRestoring}>
      {#if isRestoring}<GenericLoader class="size-4" /> Restaurando...{:else}Restaurar{/if}
    </button>
  {/snippet}
</GenericModal>
