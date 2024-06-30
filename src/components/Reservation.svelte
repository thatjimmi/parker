<script lang="ts">
  import toast, { Toaster } from "svelte-french-toast";
  import DatePicker from "../components/DatePicker/DatePicker.svelte";
  import DateInput from "../components/DatePicker/DateInput.svelte";
  import { events, fetchEvents } from "../lib/store";
  import { goto } from "$app/navigation";

  let title = "";

  let starttidspunkt = "12:00";

  let endetidspunkt = "12:00";

  let fromDate: Date | null = null;

  let toDate: Date | null = null;

  let besked = "";

  let timeBetween = "";

  $: if (fromDate && toDate && starttidspunkt && endetidspunkt && title) {
    timeBetween = getTimeBetween();
    besked = overlappingTimes();
  }

  function parseAndFormatDate(timeString: string) {
    const date = new Date(timeString);
    return formatDate(date);
  }

  function formatDate(date: Date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      timeZone: "UTC",
      minute: "numeric",
    };

    // @ts-ignore
    const formatter = new Intl.DateTimeFormat("da-DK", options);

    const formattedDate = formatter.format(date);

    const replace = formattedDate.replace(/\//g, "-");
    // first letter uppercase
    return replace.charAt(0).toUpperCase() + replace.slice(1);
  }

  function combineDateAndTime(dateObj, timeString) {
    const [hours, minutes] = timeString.split(":");
    const newDateObj = new Date(dateObj.getTime());
    newDateObj.setMinutes(Number(minutes));
    newDateObj.setSeconds(0);
    newDateObj.setMilliseconds(0);
    // format to local time
    newDateObj.setUTCHours(Number(hours));

    return newDateObj;
  }

  async function add() {
    const start = combineDateAndTime(fromDate, starttidspunkt);
    const end = combineDateAndTime(toDate, endetidspunkt);

    // start and end parsed to UTC
    console.log(formatDate(start));
    console.log(formatDate(end));

    // check if start and end is the same
    if (start.getTime() === end.getTime()) {
      toast.error("Starttidspunkt og sluttidspunkt kan ikke være det samme");
      return;
    }

    if (start > end) {
      toast.error("Starttidspunkt skal være før sluttidspunkt");
      return;
    }

    let overlappingEventsCount = 0;
    $events.forEach((e) => {
      const eventStart = new Date(e.start);
      const eventEnd = new Date(e.end);
      if (
        (start >= eventStart && start < eventEnd) || // New event starts during an existing event
        (end > eventStart && end <= eventEnd) || // New event ends during an existing event
        (start < eventStart && end > eventEnd) // New event completely overlaps an existing event
      ) {
        overlappingEventsCount++;
      }
    });

    if (overlappingEventsCount >= 2) {
      toast.error("Denne tid har allerede to reservationer");
      return;
    }

    let body = {
      apartment: title,
      start: start,
      end: end,
    };

    console.log(body);

    const response = await fetch("api/airtable", {
      method: "POST",
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

    fetchEvents("/api/airtable");
    goto("/");

    toast.success("Reservation oprettet");

    clearFields();
  }

  function getTimeBetween() {
    // @ts-ignore
    const start = combineDateAndTime(fromDate, starttidspunkt);
    // @ts-ignore
    const end = combineDateAndTime(toDate, endetidspunkt);

    const diff = end.getTime() - start.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} timer og ${minutes} minutter`;
  }

  function overlappingTimes() {
    // @ts-ignore
    const start = combineDateAndTime(fromDate, starttidspunkt);
    // @ts-ignore
    const end = combineDateAndTime(toDate, endetidspunkt);

    let overlappingEventsCount = 0;
    // @ts-ignore
    $events.forEach((e) => {
      const eventStart = new Date(e.start);
      const eventEnd = new Date(e.end);

      if (
        (start >= eventStart && start < eventEnd) || // New event starts during an existing event
        (end > eventStart && end <= eventEnd) || // New event ends during an existing event
        (start < eventStart && end > eventEnd) // New event completely overlaps an existing event
      ) {
        overlappingEventsCount++;
      }
    });

    if (overlappingEventsCount >= 2) {
      return "Denne tid har allerede to reservationer";
    }

    return "";
  }

  function clearFields() {
    title = "";
    starttidspunkt = "12:00";
    endetidspunkt = "12:00";
    fromDate = null;
    toDate = null;
  }
</script>

<Toaster />
<div class="w-full pb-8 m-4 mx-auto rounded-xl">
  <h3 class="mb-2 text-lg md:text-xl">
    <span class="text-gray-800">Lav reservation</span>
  </h3>
  <div class="hidden space-x-4 lg:flex">
    <div
      class="flex flex-col w-1/2 border pb-4 px-4 pt-4 rounded-2xl bg-white border-b-[6px] border-b-[#dfdfdf]"
    >
      <span class="mb-2 ml-2">Fra </span>
      <DatePicker bind:value={fromDate} />
    </div>
    <div
      class="flex flex-col w-1/2 border pb-4 px-4 pt-4 rounded-2xl bg-white border-b-[6px] border-b-[#dfdfdf]"
    >
      <span class="mb-2 ml-2">Til </span>
      <DatePicker bind:value={toDate} />
    </div>
  </div>
  <div class="flex flex-col lg:hidden">
    <div
      class="mx-auto space-y-1 w-full rounded-xl bg-white p-4 border border-b-[6px] border-b-[#dfdfdf]"
    >
      <p>Fra</p>
      <DateInput
        bind:value={fromDate}
        styling="text-md text-center w-full text-gray-800 bg-slate-50 rounded-xl py-1.5"
      />
      <p>Til</p>
      <DateInput
        bind:value={toDate}
        styling="text-md w-full text-gray-800 text-center bg-slate-50 rounded-xl py-1.5"
      />
    </div>
  </div>

  <div class="pt-4 space-y-2 lg:flex lg:space-x-4 lg:space-y-0">
    <div
      class="flex flex-col space-y-4 lg:w-1/2 mx-auto bg-white p-4 rounded-xl border border-b-[6px] border-b-[#dfdfdf]"
    >
      <div class="flex space-x-2">
        <div class="flex flex-col w-full space-y-2">
          <label for="start">Starttidspunkt</label>
          <input
            type="time"
            class="px-4 bg-slate-50 pt-2 pb-1.5 w-full rounded-lg border"
            id="start"
            name="start"
            placeholder="00:00"
            bind:value={starttidspunkt}
          />
        </div>
        <div class="flex flex-col w-full space-y-2">
          <label for="end">Sluttidspunkt</label>
          <input
            type="time"
            class="px-4 bg-slate-50 pt-2 pb-1.5 w-full rounded-lg border"
            id="end"
            name="end"
            placeholder="00:00"
            bind:value={endetidspunkt}
          />
        </div>
      </div>
      <div class="flex flex-col space-y-2">
        <label for="title">
          <p>
            Hvem reserverer? <span class="text-gray-500"
              >(navn, lejlighed, evt. bil)</span
            >
          </p>
          <span class="text-sm">
            Bil kan være nyttigt at oplyse så vi kan skælne mellem om det er
            vedkommende der har reserveret der holder der eller ej. Angiv hvis
            det er vigtigt hvilken af de to pladser der reserveres.
          </span>
        </label>

        <input
          class="px-4 py-2 text-gray-800 border rounded-lg bg-slate-50"
          type="text"
          id="title"
          placeholder="Navn, lejlighed, evt. bil"
          name="title"
          bind:value={title}
        />
      </div>
    </div>
    {#if fromDate && toDate && starttidspunkt && endetidspunkt && title}
      <div
        class=" text-gray-900 lg:w-1/2 space-y-4 bg-white p-4 rounded-xl border border-b-[6px] border-b-[#dfdfdf]"
      >
        <div class="space-y-2">
          <p>Valgt fra</p>
          <p class="px-4 py-2 border rounded-lg bg-slate-50">
            {parseAndFormatDate(combineDateAndTime(fromDate, starttidspunkt))}
          </p>
        </div>
        <div class="space-y-2">
          <p>Til</p>
          <p class="px-4 py-2 border rounded-lg bg-slate-50">
            {parseAndFormatDate(combineDateAndTime(toDate, endetidspunkt))}
          </p>
        </div>
        <p>
          I alt {timeBetween}
        </p>
        <p>Ser det rigtigt ud?</p>
      </div>
    {:else}
      <div class="text-center text-gray-900 rounded-lg lg:w-1/2" />
    {/if}
  </div>
  {#if fromDate && toDate && starttidspunkt && endetidspunkt && title}
    <div class="flex flex-col mt-4 text-center">
      <p>{besked}</p>
      <button
        class="bg-[#111727] mt-2 text-white py-2 px-2 lg:w-1/3 rounded-lg w-full mx-auto border"
        type="submit"
        on:click={add}>Lav reservation</button
      >
    </div>
  {:else}
    <div class="text-center">
      <p
        class="w-full px-2 py-2 mx-auto mt-6 text-gray-500 bg-gray-300 border rounded-lg lg:w-1/3"
      >
        Lav reservation
      </p>
    </div>
  {/if}
</div>
