<!-- https://github.com/vkurko/calendar -->
<script>
  // import Calendar from "../components/@event-calendar/core";
  // @ts-ignore
  import Calendar from "@event-calendar/core";
  // @ts-ignore
  import TimeGrid from "@event-calendar/time-grid";
  // @ts-ignore
  import Interaction from "@event-calendar/interaction";
  // @ts-ignore
  // import List from "../components/@event-calendar/list";
  import List from "@event-calendar/list";
  // @ts-ignore
  import DayGrid from "@event-calendar/day-grid";
  import DatePicker from "../components/DatePicker/DatePicker.svelte";
  import DateInput from "../components/DatePicker/DateInput.svelte";
  import { onMount } from "svelte";
  import { invalidate } from "$app/navigation";
  import { error } from "@sveltejs/kit";

  // @ts-ignore
  let events = [];

  async function fetchEvents() {
    // Fetch new event data
    const response = await fetch("/api/airtable");
    if (response.ok) {
      const newData = await response.json();
      // Update the events array
      events = newData;
      options.events = events;
      nearestEvents = getNearestEvents();
      timeUntilNextEvent = getTimeUntilNextEvent();
    }
  }

  let loading = true;
  onMount(async () => {
    await fetchEvents();
    setTimeout(() => {
      loading = false;
    }, 1000);
  });

  // @ts-ignore
  let fromDate = null;
  // @ts-ignore
  let toDate = null;

  // let plugins = [TimeGrid, Interaction];
  $: plugins = [DayGrid];

  let view = "dayGrid";
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

  // let plugins = [List];
  let options = {
    // view: "dayGrid",
    // @ts-ignore
    events: events,
    allDaySlot: false,
    // @ts-ignore
    dateClick: (e) => {
      // console.log("dateClick", e);
    },
    // @ts-ignore
    eventClick: (e) => {
      chosenEvent = e.event;
    },
    // @ts-ignore
    eventContent: (e) => {
      return `${e.event.title}`;
    },
    // @ts-ignore
    noEventsClick: (e) => {
      // console.log("noEventClicks", e);
    },
    buttonText: {
      today: "I dag",
      month: "Måned",
      week: "Uge",
      day: "Dag",
      list: "Liste",
    },
  };

  function overlappingTimes() {
    // @ts-ignore
    const start = combineDateAndTime(fromDate, starttidspunkt);
    // @ts-ignore
    const end = combineDateAndTime(toDate, endetidspunkt);

    let overlappingEventsCount = 0;
    // @ts-ignore
    events.forEach((e) => {
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

  let opdaterReservation = false;

  let besked = "";
  let timeBetween = "";
  $: if (fromDate && toDate && starttidspunkt && endetidspunkt && title) {
    timeBetween = getTimeBetween();
    besked = overlappingTimes();
  }

  // @ts-ignore
  function getHoursAndMinutes(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  }

  // @ts-ignore
  function formatDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    // @ts-ignore
    const formatter = new Intl.DateTimeFormat("da-DK", options, {
      timeZone: "Europe/Copenhagen",
    });

    const formattedDate = formatter.format(date);

    const replace = formattedDate.replace(/\//g, "-");
    // first letter uppercase
    return replace.charAt(0).toUpperCase() + replace.slice(1);
  }

  // @ts-ignore
  function parseAndFormatDate(timeString) {
    const date = new Date(timeString);
    return formatDate(date);
  }

  function parseAndFormatDate2(timeString) {
    const date = new Date(timeString);
    const oneHourLater = date.setHours(date.getHours() + 1);
    return formatDate(new Date(oneHourLater));
  }

  // @ts-ignore
  function combineDateAndTime(dateObj, timeString) {
    const [hours, minutes] = timeString.split(":");
    const newDateObj = new Date(dateObj.getTime());
    newDateObj.setHours(Number(hours));
    newDateObj.setMinutes(Number(minutes));
    newDateObj.setSeconds(0);
    newDateObj.setMilliseconds(0);

    return newDateObj;
  }

  let chosenEvent = {};
  let title = "";
  let starttidspunkt = "12:00";
  let endetidspunkt = "12:00";

  async function add() {
    // @ts-ignore
    const start = combineDateAndTime(fromDate, starttidspunkt);
    // @ts-ignore
    const end = combineDateAndTime(toDate, endetidspunkt);

    // check if start and end is the same
    if (start.getTime() === end.getTime()) {
      alert("Starttidspunkt og sluttidspunkt kan ikke være det samme");
      return;
    }

    if (start > end) {
      alert("Starttidspunkt skal være før sluttidspunkt");
      return;
    }

    let overlappingEventsCount = 0;
    // @ts-ignore
    events.forEach((e) => {
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
      alert("Denne tid har allerede to reservationer");
      return;
    }

    let body = {
      apartment: title,
      start: start,
      end: end,
    };

    const response = await fetch("api/airtable", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    nearestEvents = getNearestEvents();
    fetchEvents();

    clearFields();
  }

  let showCalendar = true;

  function toggleSwitch() {
    showCalendar = !showCalendar;
  }

  function getNearestEvent() {
    const now = new Date();
    // @ts-ignore
    const sortedEvents = events.sort((a, b) => {
      const aDate = new Date(a.start);
      const bDate = new Date(b.start);
      // @ts-ignore
      return aDate - bDate;
    });

    // const nearestEvent = sortedEvents.find((e) => {
    //     const eventDate = new Date(e.start);
    //     return eventDate > now
    // });

    let nearestEvent = null;

    for (let i = 0; i < sortedEvents.length; i++) {
      const eventDate = new Date(sortedEvents[i].start);
      if (eventDate > now) {
        nearestEvent = sortedEvents[i];
        break;
      }
      // if event is in the past compared to now but the span of the event is still ongoing return the event
      if (eventDate < now) {
        const eventEndDate = new Date(sortedEvents[i].end);
        if (eventEndDate > now) {
          nearestEvent = sortedEvents[i];
          break;
        }
      }
    }

    // if no event is found return empty event
    if (!nearestEvent) {
      return {
        title: "ingen",
        start: "1970-01-01T00:00:00.000Z",
        end: "1970-01-01T00:00:00.000Z",
      };
    }

    return nearestEvent;
  }

  function getNearestEvents() {
    const now = new Date();

    // @ts-ignore
    const sortedEvents = events.sort(
      // @ts-ignore
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    let nearestEvents = sortedEvents.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return eventStart > now || (eventStart <= now && eventEnd > now);
    });

    // Limit to the first two upcoming or ongoing events
    return nearestEvents.slice(0, 2);
  }

  // @ts-ignore
  $: nearestEvent = getNearestEvent();
  $: nearestEvents = getNearestEvents();

  // @ts-ignore
  function getTimeUntilEvent(eventTime, eventEndTime) {
    const now = new Date();
    const eventStartDate = new Date(eventTime);
    const eventEndDate = new Date(eventEndTime);

    if (!eventTime || isNaN(eventStartDate.getTime())) {
      return "Ugyldigt starttidspunkt for begivenheden";
    }

    if (!eventEndTime || isNaN(eventEndDate.getTime())) {
      return "Ugyldigt sluttidspunkt for begivenheden";
    }

    if (now.getTime() > eventEndDate.getTime()) {
      // Hvis begivenhedens sluttidspunkt er i fortiden
      return "Reservation er forbi";
    } else if (
      now.getTime() >= eventStartDate.getTime() &&
      now.getTime() <= eventEndDate.getTime()
    ) {
      // Hvis begivenheden er i gang
      return "Reservation er i gang";
    } else {
      // Hvis begivenheden er i fremtiden
      const diff = eventStartDate.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `Tid til reservation: ${hours} timer og ${minutes} minutter`;
    }
  }

  // function that returns the time until the next event
  function getTimeUntilNextEvent() {
    const now = new Date();
    const nearestEvent = getNearestEvent();

    const eventDate = new Date(nearestEvent.start);
    // @ts-ignore
    const diff = eventDate - now;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60 / 60 - hours) * 60);

    // if the time of now is between the start and end of the event, return "nu"
    if (
      now > new Date(nearestEvent.start) &&
      now < new Date(nearestEvent.end)
    ) {
      return "er i gang nu";
    }

    // if no event is found in the future return the last event
    if (new Date(nearestEvent.end) < now) {
      return "Ikke flere reservationer";
    }

    return `om ${hours} timer og ${minutes} minutter`;
  }

  async function updateReservation(title, start, end, id) {
    let body = {
      id: id,
      apartment: title,
      start: start,
      end: end,
    };

    const response = await fetch("api/airtable", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    invalidate("/api/airtable");

    // @ts-ignore
    events = [...events, event];

    options.events = events;
  }

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
      alert(data.error);
      return;
    }

    chosenEvent = {};
    opdaterReservation = false;
    fetchEvents();
  }

  $: timeUntilNextEvent = getTimeUntilNextEvent();
</script>

<!-- <h3
    class="text-3xl md:text-4xl xl:text-5xl text-center font-semibold pt-4 px-8"
>
    Reservation af parkeringsplads
</h3> -->
<div
  class="flex flex-col px-4 justify-center bg-[#F7F7F7] max-w-12xl mx-auto text-[#16182F]"
>
  <!-- switch toggle for switching between calendar and booking a spot -->
  <div class="flex pt-4 justify-center">
    <div class="border rounded-3xl overflow-hidden">
      <button
        class="{showCalendar ? 'bg-white  ' : ''}  px-3 pl-4 py-1"
        on:click={toggleSwitch}
      >
        <span class="text-sm">Kalender</span>
      </button>

      <button
        class="{!showCalendar ? 'bg-white ' : ''}  px-3 pr-4 py-1"
        on:click={toggleSwitch}
      >
        <span class="text-sm">Reserver</span>
      </button>
    </div>
  </div>
  {#if !showCalendar}
    <div
      class="pb-8 w-full md:w-4/5 lg:w-4/5 xl:w-3/5 2xl:w-1/2 mx-auto m-4 rounded-xl"
    >
      <h3 class="text-lg md:text-xl mb-2">
        <span class="text-gray-800">Lav reservation</span>
      </h3>
      <div class="lg:flex space-x-4 hidden">
        <div
          class="flex flex-col w-1/2 border pb-4 px-4 pt-4 rounded-2xl bg-white"
        >
          <span class="mb-2">Fra </span>
          <DatePicker bind:value={fromDate} />
        </div>
        <div
          class="flex flex-col w-1/2 border pb-4 px-4 pt-4 rounded-2xl bg-white"
        >
          <span class="mb-2">Til </span>
          <DatePicker bind:value={toDate} />
        </div>
      </div>
      <div class="flex flex-col lg:hidden">
        <div class="mx-auto space-y-1 w-full rounded-xl bg-white p-4 border">
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

      <div class="lg:flex pt-4 lg:space-x-4 space-y-2 lg:space-y-0">
        <div
          class="flex flex-col space-y-4 lg:w-1/2 mx-auto bg-white p-4 rounded-xl border"
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
                vedkommende der har reserveret der holder der eller ej. Angiv
                hvis det er vigtigt hvilken af de to pladser der reserveres.
              </span>
            </label>

            <input
              class="bg-slate-50 px-4 py-2 text-gray-800 rounded-lg border"
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
            class=" text-gray-900 lg:w-1/2 space-y-4 bg-white p-4 rounded-xl border"
          >
            <div class="space-y-2">
              <p>Valgt fra</p>
              <p class="bg-slate-50 px-4 py-2 rounded-lg border">
                {parseAndFormatDate(
                  combineDateAndTime(fromDate, starttidspunkt)
                )}
              </p>
            </div>
            <div class="space-y-2">
              <p>Til</p>
              <p class="bg-slate-50 px-4 py-2 rounded-lg border">
                {parseAndFormatDate(combineDateAndTime(toDate, endetidspunkt))}
              </p>
            </div>
            <p>
              I alt {timeBetween}
            </p>
            <p>Ser det rigtigt ud?</p>
          </div>
        {:else}
          <div class="rounded-lg text-gray-900 text-center lg:w-1/2" />
        {/if}
      </div>
      {#if fromDate && toDate && starttidspunkt && endetidspunkt && title}
        <div class="text-center flex flex-col mt-4">
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
            class="bg-gray-300 mt-6 text-gray-500 py-2 px-2 lg:w-1/3 w-full rounded-lg mx-auto border"
          >
            Lav reservation
          </p>
        </div>
      {/if}
    </div>
  {/if}
  {#if showCalendar}
    <div
      class="pb-6 w-full md:w-4/5 lg:w-4/5 xl:w-3/5 2xl:w-1/2 mx-auto rounded-xl mb-4"
    >
      <div class="mt-4 mx-auto mb-4">
        <h3 class="text-lg md:text-xl mb-2">
          <span class="text-gray-800">Kommende reserveringer </span>
        </h3>
        {#if nearestEvents && nearestEvents.length > 0 && !loading}
          <div class="grid md:grid-cols-2 gap-4">
            {#each nearestEvents as event}
              <div class="bg-white rounded-2xl p-4 border">
                <h4 class="md:text-lg">{event.title}</h4>
                <span class="text-[16px] text-gray-700 flex">
                  {getTimeUntilEvent(event.start, event.end)}
                </span>

                <div class="event-details">
                  <p class="">
                    <span class="text-gray-500">Fra</span>
                    {parseAndFormatDate(event.start)}
                  </p>
                  <p class="">
                    <span class="text-gray-500">Til</span>
                    {parseAndFormatDate(event.end)}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div
            class="flex items-center justify-between p-4 bg-white border rounded-xl animate-pulse w-1/2"
          >
            <div class="space-y-2">
              <div class="h-6 w-32 bg-gray-300 rounded" />
              <div class="h-4 w-48 bg-gray-300 rounded" />
              <div class="h-4 w-40 bg-gray-300 rounded" />
              <div class="h-4 w-40 bg-gray-300 rounded" />
            </div>
          </div>
        {/if}
      </div>
      {#if !loading}
        <div class="">
          {#key plugins}
            <button
              on:click={() => setOptionsPlugins()}
              class="text-gray-700 bg-white border py-1 px-2 rounded-lg text-sm mb-2"
              >Skift kalendervisning</button
            >
            <Calendar {plugins} {options} />
          {/key}
        </div>
      {/if}
      {#if loading}
        <div
          class="w-full mx-auto my-8 animate-pulse bg-white border p-4 rounded-xl"
        >
          <!-- Calendar Grid Skeleton -->
          <div class="grid grid-cols-7 gap-3 py-2">
            <!-- Column Header Skeletons -->

            <div class="h-4 bg-gray-300 rounded" />
            <div class="h-4 bg-gray-300 rounded" />
            <div class="h-4 bg-gray-300 rounded" />
            <div class="h-4 bg-gray-300 rounded" />
            <div class="h-4 bg-gray-300 rounded" />
            <div class="h-4 bg-gray-300 rounded" />
            <div class="h-4 bg-gray-300 rounded" />
            <!-- Calendar Day Skeletons (Repeat similar divs for each day) -->
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
            <!-- Highlighted Day Skeletons -->
            <div class="h-8 bg-gray-400 rounded" />
            <div class="h-8 bg-gray-400 rounded" />
            <div class="h-8 bg-gray-400 rounded" />
            <!-- ... other days -->
          </div>
        </div>
      {/if}
      {#if chosenEvent && chosenEvent.id}
        <div class="mt-4 bg-white mx-auto px-4 pb-4 py-3 rounded-xl border">
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
                  class="mt-2 px-2.5 py-1 bg-red-700 rounded-xl text-white"
                >
                  Slet reservation
                </button>
              </div>
            {/if}
          </div>
        </div>
      {:else if !loading}
        <div class="mt-4">
          <h3 class="text-xl">Ingen reservation valgt</h3>
        </div>
      {/if}
    </div>
  {/if}
</div>
