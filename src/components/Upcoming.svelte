<script>
  import { events } from "../lib/store";

  export let loadingState = true;

  let nearestEvents = [];

  $: if ($events && $events.length > 0) {
    nearestEvents = getNearestEvents();
  }

  function getNearestEvents(numberOfEvents = 2) {
    const now = new Date();

    const sortedEvents = $events.sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    let nearestEvents = sortedEvents.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return eventStart > now || (eventStart <= now && eventEnd > now);
    });

    // Limit to the first two upcoming or ongoing events
    return nearestEvents.slice(0, numberOfEvents);
  }

  function parseAndFormatDate(timeString) {
    const date = new Date(timeString);
    return formatDate(date);
  }

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
</script>

{#if !loadingState}
  <div class="w-full mx-auto rounded-xl">
    <div class="mt-4 mx-auto">
      <h3 class="text-lg md:text-xl mb-2">
        <span class="text-gray-800">Kommende reserveringer </span>
      </h3>
      {#if nearestEvents && nearestEvents.length > 0}
        <div class="grid md:grid-cols-2 gap-4">
          {#each nearestEvents as event}
            <div
              class="bg-white rounded-2xl p-4 border border-b-[6px] border-b-[#dfdfdf]"
            >
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
        <div class="">
          <h3 class="text-lg text-slate-600">Ingen kommende reservationer</h3>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div
    class="flex items-center justify-between p-4 mt-4 bg-white border rounded-xl animate-pulse w-full md:w-1/2"
  >
    <div class="space-y-2">
      <div class="h-6 w-32 bg-gray-300 rounded" />
      <div class="h-4 w-48 bg-gray-300 rounded" />
      <div class="h-4 w-40 bg-gray-300 rounded" />
      <div class="h-4 w-40 bg-gray-300 rounded" />
    </div>
  </div>
{/if}
