<script>
  // import DatePicker from '../components/DatePicker/DatePicker.svelte';
  // import DateInput from '../components/DatePicker/DateInput.svelte';
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import DayGrid from "@event-calendar/day-grid";

  let plugins = [DayGrid];

  let fromDate;
  let toDate;
  let starttidspunkt;
  let endetidspunkt;
  let title;
</script>

<div
  class="pb-8 md:pt-8 px-8 w-full md:w-4/5 lg:w-4/5 xl:w-3/5 2xl:w-1/2 mx-auto md:shadow border-gray-300 md:border m-4 rounded-xl"
>
  <div class="lg:flex space-x-4 hidden">
    <div
      class="w-1/2 shadow border pt-6 pb-4 px-4 rounded-xl border-gray-300 bg-gray-50"
    >
      <!-- <DatePicker bind:value={fromDate} /> -->
    </div>
    <div
      class="w-1/2 border shadow pt-6 pb-4 px-4 rounded-xl border-gray-300 bg-gray-50"
    >
      <!-- <DatePicker bind:value={toDate} /> -->
    </div>
  </div>
  <div class="flex flex-col lg:hidden">
    <div class="mx-auto space-y-1 w-full">
      <p>Fra</p>
      <!-- <DateInput
      bind:value={fromDate}
      styling="text-lg text-center w-full text-gray-800 bg-gray-100"
    /> -->
      <p>Til</p>
      <!-- <DateInput
      bind:value={toDate}
      styling="text-lg w-full text-gray-800 text-center bg-gray-100"
    /> -->
    </div>
  </div>

  <div class="lg:flex pt-4 lg:space-x-4 space-y-2 lg:space-y-0">
    <div class="flex flex-col space-y-4 lg:w-1/2 mx-auto">
      <div class="flex space-x-2">
        <div class="flex flex-col w-full space-y-2">
          <label for="start">Starttidspunkt</label>
          <input
            type="time"
            class="px-4 bg-gray-100 pt-2 pb-1.5 w-full rounded-lg border border-gray-300"
            id="start"
            name="start"
            placeholder="00:00"
            step="3600"
            bind:value={starttidspunkt}
          />
        </div>
        <div class="flex flex-col w-full space-y-2">
          <label for="end">Sluttidspunkt</label>
          <input
            type="time"
            class="px-4 bg-gray-100 pt-2 pb-1.5 w-full rounded-lg border border-gray-300"
            id="end"
            name="end"
            placeholder="00:00"
            step="3600"
            bind:value={endetidspunkt}
          />
        </div>
      </div>
      <div class="flex flex-col space-y-2">
        <label for="title">Lejlighed</label>
        <input
          class="bg-gray-100 px-4 py-2 text-gray-800 rounded-lg border border-gray-300"
          type="text"
          id="title"
          name="title"
          bind:value={title}
        />
      </div>
    </div>
    <!-- {#if fromDate && toDate && starttidspunkt && endetidspunkt && title} -->
    <div class="rounded-lg text-gray-900 lg:w-1/2 space-y-4">
      <div class="space-y-2">
        <p>Valgt fra</p>
        <p class="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
          <!-- {parseAndFormatDate(combineDateAndTime(fromDate, starttidspunkt))} -->
        </p>
      </div>
      <div class="space-y-2">
        <p>Til</p>
        <p class="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
          <!-- {parseAndFormatDate(combineDateAndTime(toDate, endetidspunkt))} -->
        </p>
      </div>
    </div>
  </div>
</div>

<Calendar {plugins} />
