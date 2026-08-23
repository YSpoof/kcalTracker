<script lang="ts">
  import { onMount } from "svelte";
  import BullseyeIcon from "~icons/mdi/bullseye";
  import ChevronRightIcon from "~icons/mdi/chevron-right";
  import FireIcon from "~icons/mdi/fire";
  import FoodSteakOffIcon from "~icons/mdi/food-steak-off";
  import PlusCircleIcon from "~icons/mdi/plus-circle";
  import WaterIcon from "~icons/mdi/water";

  import DailyMealModal from "#lib/frontend/components/modals/DailyMealModal.svelte";
  import BarChart from "#lib/frontend/components/ui/BarChart.svelte";
  import EmptyState from "#lib/frontend/components/ui/EmptyState.svelte";
  import StatCard from "#lib/frontend/components/ui/StatCard.svelte";
  import type { DailyMeal, MealType } from "#lib/frontend/services/db/schema/index.js";
  import { mealService } from "#lib/frontend/services/mealService.js";
  import { settingsService } from "#lib/frontend/services/settingsService.js";
  import type { ModalMode } from "#lib/frontend/types.js";
  import {
    formatFullDate,
    getDayOfMonth,
    getLastNDates,
    getShortDayOfWeek,
  } from "#lib/frontend/utils/date.js";
  import { formatNumber } from "#lib/frontend/utils/formatters.js";

  let target = $state(2000);

  let dailyMeals = $state<DailyMeal[]>([]);
  let availableMeals = $state<MealType[]>([]);
  let weeklyData = $state<{ labels: string[]; values: number[] }>({ labels: [], values: [] });

  let totalCalories = $derived(dailyMeals.reduce((acc, meal) => acc + meal.calories, 0));
  let remainingCalories = $derived(Math.max(0, target - totalCalories));
  let modalOpen = $state(false);
  let modalMode = $state<ModalMode>("create");
  let editingMeal = $state<DailyMeal | null>(null);

  const openModal = (mode: ModalMode, meal: DailyMeal | null) => {
    modalMode = mode;
    editingMeal = meal;
    modalOpen = true;
  };

  const closeModal = () => {
    modalOpen = false;
    editingMeal = null;
  };

  const handleModalSubmit = async () => {
    await Promise.all([reloadDailyMeals(), loadWeeklyData()]);
    closeModal();
  };

  const reloadDailyMeals = async () => {
    const dailyMealsResponse = await mealService.getDailyMeals();
    dailyMeals = dailyMealsResponse;
  };

  const loadWeeklyData = async () => {
    const dates = getLastNDates(7);
    const meals = await mealService.getDailyMealsByDateRange(dates[0], dates[dates.length - 1]);

    const totalsByDate = new Map<string, number>();
    for (const meal of meals) {
      totalsByDate.set(meal.date, (totalsByDate.get(meal.date) ?? 0) + meal.calories);
    }

    weeklyData = {
      labels: dates.map((date) => `${getShortDayOfWeek(date)}\n${getDayOfMonth(date)}`),
      values: dates.map((date) => totalsByDate.get(date) ?? 0),
    };
  };

  onMount(async () => {
    const [dailyMealsResponse, availableMealsResponse, targetResponse] = await Promise.all([
      mealService.getDailyMeals(),
      mealService.getMeals(),
      settingsService.getCalorieGoal(),
      loadWeeklyData(),
    ]);

    dailyMeals = dailyMealsResponse;
    availableMeals = availableMealsResponse;
    target = targetResponse;
  });
</script>

<div class="space-y-4">
  <!-- Greeting Header -->
  <div class="mb-2">
    <h1 class="text-2xl font-bold">Kcal Tracker</h1>
    <p class="text-base-content/60 text-sm">{formatFullDate()}</p>
  </div>

  <!-- Weekly Calories Chart -->
  <div class="card bg-base-100 dark:bg-base-300 shadow-sm">
    <div class="card-body">
      <h2 class="card-title text-base">Consumo dos últimos 7 dias</h2>
      <BarChart
        labels={weeklyData.labels}
        values={weeklyData.values}
        {target} />
    </div>
  </div>

  <!-- Action Button -->
  <button
    class="w-full cursor-pointer rounded-2xl bg-linear-to-r from-green-600 to-green-700 p-4 text-white shadow-sm transition-transform active:scale-[0.99]"
    onclick={() => openModal("create", null)}>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <PlusCircleIcon class="size-8 shrink-0" />
        <div class="text-left">
          <h3 class="font-bold">Registrar refeição</h3>
          <p class="text-xs opacity-90">Adicione uma refeição que você comeu</p>
        </div>
      </div>
      <ChevronRightIcon class="size-6 shrink-0 opacity-80" />
    </div>
  </button>

  <!-- Daily Summary Card -->
  <div class="card bg-base-100 dark:bg-base-300 shadow-sm">
    <div class="card-body">
      <h2 class="card-title text-base">Resumo de hoje</h2>
      <div class="mt-2 flex flex-row items-center justify-around">
        <StatCard
          Icon={FireIcon}
          iconBgClass="bg-green-100 dark:bg-green-500/15"
          iconClass="text-green-600"
          value={formatNumber(totalCalories)}
          label="Consumidas"
          valueClass="text-green-600" />
        <div class="divider divider-horizontal my-0"></div>
        <StatCard
          Icon={BullseyeIcon}
          iconBgClass="bg-yellow-100 dark:bg-yellow-500/15"
          iconClass="text-yellow-500"
          value={formatNumber(target)}
          label="Meta"
          valueClass="text-yellow-500" />
        <div class="divider divider-horizontal my-0"></div>
        <StatCard
          Icon={WaterIcon}
          iconBgClass="bg-blue-100 dark:bg-blue-500/15"
          iconClass="text-blue-500"
          value={formatNumber(remainingCalories)}
          label="Restantes"
          valueClass="text-blue-500" />
      </div>
    </div>
  </div>

  <!-- Registered Meals Card -->
  <div class="card bg-base-100 dark:bg-base-300 w-full shadow-sm">
    <div class="card-body">
      <div class="flex items-center justify-between">
        <h2 class="card-title text-base">Refeições de hoje</h2>
        <span class="badge badge-sm badge-ghost">{dailyMeals.length}</span>
      </div>
      <ul class="divide-base-content/10 mt-2 divide-y">
        {#each dailyMeals as dailyMeal (dailyMeal.id)}
          <li class="py-1">
            <button
              class="btn btn-ghost btn-sm w-full justify-between font-normal"
              onclick={() => openModal("update", dailyMeal)}>
              <span class="font-medium">{dailyMeal.name}</span>
              <span class="text-secondary text-xs font-semibold"
                >{formatNumber(dailyMeal.calories)} KCal</span>
            </button>
          </li>
        {:else}
          <div class="pt-2">
            <EmptyState message="Nada ainda hoje">
              <FoodSteakOffIcon class="size-6 opacity-40" />
            </EmptyState>
          </div>
        {/each}
      </ul>
    </div>
  </div>
</div>

<DailyMealModal
  open={modalOpen}
  mode={modalMode}
  meal={editingMeal}
  {availableMeals}
  onSubmit={handleModalSubmit}
  onClose={closeModal} />
