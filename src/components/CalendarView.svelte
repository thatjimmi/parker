<script>
  import { events, fetchEvents } from "../lib/store";
  import toast, { Toaster } from "svelte-french-toast";
  import Calendar from "@event-calendar/core";
  import TimeGrid from "@event-calendar/time-grid";
  import List from "@event-calendar/list";
  import DayGrid from "@event-calendar/day-grid";

  export let loadingState = true;

  let opdaterReservation = false;

  let plugins = [DayGrid];

  let view = "dayGrid";

  let chosenEvent = {};

  function formatDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    const formatter = new Intl.DateTimeFormat("da-DK", options, {
      timeZone: "Europe/Copenhagen",
    });

    const formattedDate = formatter.format(date);

    const replace = formattedDate.replace(/\//g, "-");
    // first letter uppercase
    return replace.charAt(0).toUpperCase() + replace.slice(1);
  }

  function parseAndFormatDate2(timeString) {
    const date = new Date(timeString);
    const oneHourLater = date.setHours(date.getHours() + 1);
    return formatDate(new Date(oneHourLater));
  }

  function setOptionsPlugins() {
    // shift between dayGrid and timeGrid and list
    if (view === "dayGrid") {
      plugins = [TimeGrid];
      view = "timeGrid";
    } else if (view === "timeGrid") {
      plugins = [List];
      view = "list";
    } else if (view === "list") {
      plugins = [DayGrid];
      view = "dayGrid";
    }
  }

  $: options = {
    events: $events,
    allDaySlot: false,
    eventClick: (e) => {
      chosenEvent = e.event;
    },
    eventContent: (e) => {
      return `${e.event.title}`;
    },
    buttonText: {
      today: "I dag",
      month: "Måned",
      week: "Uge",
      day: "Dag",
      list: "Liste",
    },
  };

  async function deleteReservation(id) {
    let body = {
      id: id,
    };
    const response = await fetch("api/airtable", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      toast.error(data.error);
      return;
    }

    chosenEvent = {};
    opdaterReservation = false;

    fetchEvents("api/airtable");

    toast.success("Reservation slettet");
  }
</script>

<Toaster />
{#if !loadingState}
  <div class="flex">
    <button
      on:click={() => setOptionsPlugins()}
      class="text-gray-700 bg-white border py-1 px-2 rounded-lg text-sm border-b-[3px] border-b-[#dfdfdf]"
      >Skift kalendervisning</button
    >
  </div>
  {#key plugins}
    <Calendar {plugins} {options} />
  {/key}
  {#if chosenEvent && chosenEvent.id}
    <div
      class="mt-4 bg-white mx-auto px-4 pb-4 py-3 border border-b-[6px] border-b-[#dfdfdf] rounded-xl w-full"
    >
      <h3 class="text-xl">
        <span class="">Reservation af</span>
        {chosenEvent?.title}
      </h3>
      <div class="flex text-gray-600 space-x-2 text-sm">
        <div class="space-y-0 w-1/2">
          <p>Fra</p>
          <p class=" text-gray-800">
            {parseAndFormatDate2(chosenEvent.start)}
          </p>
        </div>
        <div class="space-y-0 w-1/2">
          <p>Til</p>
          <p class=" text-gray-800">
            {parseAndFormatDate2(chosenEvent.end)}
          </p>
        </div>
      </div>
      <div>
        <button
          class="mt-4 text-sm text-slate-600"
          on:click={() => (opdaterReservation = !opdaterReservation)}
        >
          Opdater reservation
        </button>
        {#if opdaterReservation}
          <div>
            <button
              on:click={() => deleteReservation(chosenEvent.id)}
              class="mt-2 px-2.5 py-1 bg-red-700 rounded-lg text-white"
            >
              Slet reservation
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else if events}
    <div class="mt-4">
      <h3 class="text-xl">Ingen reservation valgt</h3>
    </div>
  {/if}
{:else}
  <div
    class="h-8 bg-white border mt-2 animate-pulse rounded-lg w-1/6 border-b-[3px] border-b-[#dfdfdf]"
  />
  <div
    class="w-full mx-auto my-2 animate-pulse bg-white border p-4 rounded-xl border-b-[6px] border-b-[#dfdfdf]"
  >
    <div class="grid grid-cols-7 gap-3 py-2">
      <div class="h-4 bg-gray-300 rounded" />
      <div class="h-4 bg-gray-300 rounded" />
      <div class="h-4 bg-gray-300 rounded" />
      <div class="h-4 bg-gray-300 rounded" />
      <div class="h-4 bg-gray-300 rounded" />
      <div class="h-4 bg-gray-300 rounded" />
      <div class="h-4 bg-gray-300 rounded" />
      <div class="gap-3 grid">
        <div class="h-8 bg-gray-300 rounded" />
        <div class="h-8 bg-gray-300 rounded" />
      </div>
      <div class="gap-3 grid">
        <div class="h-8 bg-gray-400 rounded" />
        <div class="h-8 bg-gray-400 rounded" />
      </div>
      <div class="gap-3 grid">
        <div class="h-8 bg-gray-400 rounded" />
        <div class="h-8 bg-gray-400 rounded" />
      </div>
      <div class="h-8 bg-gray-400 rounded" />
      <div class="h-8 bg-gray-400 rounded" />
      <div class="h-8 bg-gray-400 rounded" />
    </div>
  </div>
{/if}
