<script lang="ts">
  import { onMount } from "svelte";
  import CalendarIcon from "~icons/mdi/calendar-month";
  import ChevronRightIcon from "~icons/mdi/chevron-right";
  import MagnifyIcon from "~icons/mdi/magnify";
  import PlusBoxIcon from "~icons/mdi/plus-box-outline";
  import WeightLifterIcon from "~icons/mdi/weight-lifter";

  import WeightModal from "#lib/frontend/components/modals/WeightModal.svelte";
  import EmptyState from "#lib/frontend/components/ui/EmptyState.svelte";
  import ItemCard from "#lib/frontend/components/ui/ItemCard.svelte";
  import LineChart from "#lib/frontend/components/ui/LineChart.svelte";
  import PageHeader from "#lib/frontend/components/ui/PageHeader.svelte";
  import type { WeightRecord } from "#lib/frontend/services/db/schema/weight.schema.js";
  import { settingsService } from "#lib/frontend/services/settingsService.js";
  import { weightService } from "#lib/frontend/services/weigthService.js";
  import type { ModalMode } from "#lib/frontend/types.js";
  import { formatDate, getDayOfWeek } from "#lib/frontend/utils/date.js";
  import { formatNumber } from "#lib/frontend/utils/formatters.js";

  let weights = $state<WeightRecord[]>([]);
  let weightGoal = $state(70);
  let search = $state("");
  let weightsByDateAsc = $derived([...weights].sort((a, b) => a.date.localeCompare(b.date)));
  let weightsByDateDesc = $derived([...weights].sort((a, b) => b.date.localeCompare(a.date)));
  let filteredWeights = $derived(
    weightsByDateDesc.filter((w) => formatDate(w.date).includes(search) || w.date.includes(search)),
  );

  let chartWeights = $derived(weightsByDateAsc.slice(-7));
  let weightChartLabels = $derived(
    chartWeights.map((w) =>
      new Date(`${w.date}T12:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    ),
  );
  let weightChartValues = $derived(chartWeights.map((w) => w.weight));

  let modalOpen = $state(false);
  let modalMode = $state<ModalMode>("create");
  let editingWeight = $state<WeightRecord | null>(null);

  const openModal = (mode: ModalMode, weight: WeightRecord | null) => {
    modalMode = mode;
    editingWeight = weight;
    modalOpen = true;
  };

  const closeModal = () => {
    modalOpen = false;
    editingWeight = null;
  };

  const handleModalSubmit = async () => {
    await reloadWeights();
    closeModal();
  };

  const reloadWeights = async () => {
    weights = await weightService.getWeights();
  };

  onMount(async () => {
    const [weightsResponse, weightGoalResponse] = await Promise.all([
      weightService.getWeights(),
      settingsService.getWeightGoal(),
    ]);

    weights = weightsResponse;
    weightGoal = weightGoalResponse;
  });
</script>

<div class="space-y-4">
  <PageHeader
    title="Peso"
    subtitle="Acompanhe sua evolução de peso.">
    {#snippet actions()}
      <button
        class="btn btn-primary"
        onclick={() => openModal("create", null)}>
        <PlusBoxIcon class="size-6" />
      </button>
    {/snippet}
  </PageHeader>

  <div class="card bg-base-100 dark:bg-base-300 shadow-sm">
    <div class="card-body">
      <h2 class="card-title text-base">Últimos 7 registros</h2>
      {#if weights.length > 1}
        <LineChart
          labels={weightChartLabels}
          values={weightChartValues}
          target={weightGoal} />
      {:else}
        <p class="text-base-content/50 text-xs">Nenhum registro ainda</p>
      {/if}
    </div>
  </div>

  <label class="input w-full">
    <MagnifyIcon class="size-5 opacity-50" />
    <input
      type="search"
      class="grow"
      placeholder="Buscar por data"
      bind:value={search} />
  </label>

  <div class="space-y-2">
    {#each filteredWeights as weight (weight.id)}
      <ItemCard onclick={() => openModal("update", weight)}>
        {#snippet leading()}
          <CalendarIcon class="size-6" />
        {/snippet}
        <h2 class="card-title text-base font-bold">{formatDate(weight.date)}</h2>
        <p class="text-base-content/60 text-sm">{getDayOfWeek(weight.date)}</p>
        {#snippet trailing()}
          <div class="flex items-center gap-2">
            <p class="font-semibold">{formatNumber(weight.weight, 2)} kg</p>
            <ChevronRightIcon class="text-base-content/30 size-5" />
          </div>
        {/snippet}
      </ItemCard>
    {:else}
      <EmptyState message="Nenhuma entrada de peso cadastrada">
        <WeightLifterIcon class="size-6 opacity-40" />
      </EmptyState>
    {/each}
  </div>

  {#if filteredWeights.length > 0}
    <p class="text-base-content/40 text-center text-xs">
      Toque em uma entrada de peso para editá-la ou excluí-la
    </p>
  {/if}
</div>

<WeightModal
  open={modalOpen}
  mode={modalMode}
  weight={editingWeight}
  onSubmit={handleModalSubmit}
  onClose={closeModal} />
