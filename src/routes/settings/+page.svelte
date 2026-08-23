<script lang="ts">
  import { onMount } from "svelte";
  import DatabaseAlertIcon from "~icons/mdi/database-alert";
  import DatabaseExportIcon from "~icons/mdi/database-export";
  import DatabaseImportIcon from "~icons/mdi/database-import";
  import FireIcon from "~icons/mdi/fire";
  import WeightIcon from "~icons/mdi/weight-kilogram";

  import ClearDataModal from "#lib/frontend/components/modals/ClearDataModal.svelte";
  import GoalModal from "#lib/frontend/components/modals/GoalModal.svelte";
  import RestoreBackupModal from "#lib/frontend/components/modals/RestoreBackupModal.svelte";
  import PageHeader from "#lib/frontend/components/ui/PageHeader.svelte";
  import { backupService } from "#lib/frontend/services/backupService.js";
  import { settingsService } from "#lib/frontend/services/settingsService.js";
  import { toastStore } from "#lib/frontend/stores/toast.svelte.js";
  import type { GoalKey } from "#lib/frontend/types.js";
  import { formatNumber } from "#lib/frontend/utils/formatters.js";

  let calorieGoal = $state(2000);
  let weightGoal = $state(70);

  let goalModalOpen = $state(false);
  let goalKey = $state<GoalKey | null>(null);
  let goalInitialValue = $state(0);

  let clearModalOpen = $state(false);
  let restoreModalOpen = $state(false);
  let isBackingUp = $state(false);

  onMount(async () => {
    await reloadGoals();
  });

  const reloadGoals = async () => {
    calorieGoal = await settingsService.getCalorieGoal();
    weightGoal = await settingsService.getWeightGoal();
  };

  const openGoalModal = (key: GoalKey, currentVal: number) => {
    goalKey = key;
    goalInitialValue = currentVal;
    goalModalOpen = true;
  };

  const closeGoalModal = () => {
    goalModalOpen = false;
    goalKey = null;
  };

  const handleGoalSubmit = async () => {
    await reloadGoals();
    closeGoalModal();
  };

  const handleClearSubmit = async () => {
    await reloadGoals();
    clearModalOpen = false;
    toastStore.showToast("Dados apagados com sucesso.", "success");
  };

  const handleRestoreSubmit = async () => {
    await reloadGoals();
    restoreModalOpen = false;
    toastStore.showToast("Dados restaurados com sucesso.", "success");
  };

  const handleBackup = async () => {
    if (isBackingUp) return;

    isBackingUp = true;
    try {
      const backup = await backupService.createBackup();
      backupService.downloadBackup(backup);
      toastStore.showToast("Backup exportado com sucesso.", "success");
    } catch {
      toastStore.showToast("Não foi possível exportar o backup.", "error");
    } finally {
      isBackingUp = false;
    }
  };
</script>

<PageHeader
  title="Ajustes"
  subtitle="Personalize suas metas e gerencie seus dados." />

<h2 class="mt-6 mb-3 text-lg font-semibold">Metas</h2>
<div class="card bg-base-100 dark:bg-base-300 shadow-sm">
  <ul class="list rounded-box w-full">
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <li
      class="list-row cursor-pointer"
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && openGoalModal("calorie", calorieGoal)}
      onclick={() => openGoalModal("calorie", calorieGoal)}>
      <div class="text-primary"><FireIcon class="size-6" /></div>
      <div class="list-col-grow">
        <div>Meta diária de calorias</div>
        <div class="text-xs font-semibold opacity-60">
          Defina quantas calorias você deseja consumir por dia.
        </div>
      </div>
      <div>
        {formatNumber(calorieGoal)} kcal
      </div>
    </li>
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <li
      class="list-row cursor-pointer"
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && openGoalModal("weight", weightGoal)}
      onclick={() => openGoalModal("weight", weightGoal)}>
      <div class="text-primary"><WeightIcon class="size-6" /></div>
      <div class="list-col-grow">
        <div>Meta de peso</div>
        <div class="text-xs font-semibold opacity-60">Defina o peso que você deseja alcançar.</div>
      </div>
      <div>
        {formatNumber(weightGoal, 2)} kg
      </div>
    </li>
  </ul>
</div>

<h2 class="mt-6 mb-3 text-lg font-semibold">Backup e restauração</h2>
<div class="card bg-base-100 dark:bg-base-300 shadow-sm">
  <ul class="list rounded-box w-full">
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <li
      class="list-row cursor-pointer"
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && !isBackingUp && handleBackup()}
      onclick={() => !isBackingUp && handleBackup()}>
      <div class="text-info"><DatabaseExportIcon class="size-6" /></div>
      <div class="list-col-grow">
        <div>Fazer backup dos dados</div>
        <div class="text-xs font-semibold opacity-60">
          Salve uma cópia dos seus dados para não perder nada.
        </div>
      </div>
    </li>
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <li
      class="list-row cursor-pointer"
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && (restoreModalOpen = true)}
      onclick={() => (restoreModalOpen = true)}>
      <div class="text-success"><DatabaseImportIcon class="size-6" /></div>
      <div class="list-col-grow">
        <div>Restaurar dados</div>
        <div class="text-xs font-semibold opacity-60">
          Recupere seus dados a partir de um backup.
        </div>
      </div>
    </li>
    <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
    <li
      class="list-row cursor-pointer"
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Enter" && (clearModalOpen = true)}
      onclick={() => (clearModalOpen = true)}>
      <div class="text-error"><DatabaseAlertIcon class="size-6" /></div>
      <div class="list-col-grow">
        <div>Apagar dados</div>
        <div class="text-xs font-semibold opacity-60">
          Apague todos os seus dados para começar do zero.
        </div>
      </div>
    </li>
  </ul>
</div>

<GoalModal
  open={goalModalOpen}
  {goalKey}
  initialValue={goalInitialValue}
  onSubmit={handleGoalSubmit}
  onClose={closeGoalModal} />

<ClearDataModal
  open={clearModalOpen}
  onSubmit={handleClearSubmit}
  onClose={() => (clearModalOpen = false)} />

<RestoreBackupModal
  open={restoreModalOpen}
  onSubmit={handleRestoreSubmit}
  onClose={() => (restoreModalOpen = false)} />
