<script lang="ts">
  import CalendarIcon from "svelte-radix/Calendar.svelte";
  import type { DateRange } from "bits-ui";
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
  } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const df = new DateFormatter("da-DK", {
    dateStyle: "medium",
  });

  let value: DateRange | undefined = {
    start: new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    ),
    end: new CalendarDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    ).add({ days: 1 }),
  };

  let startValue: DateValue | undefined = undefined;
</script>

<div class="grid mx-auto">
  <Button
    variant="outline"
    class={cn(
      "w-[300px]  text-left font-normal",
      !value && "text-muted-foreground"
    )}
  >
    <CalendarIcon class="mr-2 h-4 w-4" />
    {#if value && value.start}
      {#if value.end}
        {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
          value.end.toDate(getLocalTimeZone())
        )}
      {:else}
        {df.format(value.start.toDate(getLocalTimeZone()))}
      {/if}
    {:else if startValue}
      {df.format(startValue.toDate(getLocalTimeZone()))}
    {:else}
      Pick a date
    {/if}
  </Button>
  <div class="mx-auto flex p-0">
    <RangeCalendar
      bind:value
      bind:startValue
      placeholder={value?.start}
      initialFocus
      numberOfMonths={1}
    />
  </div>
</div>
