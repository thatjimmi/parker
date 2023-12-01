<script>
  import CalendarView from "../components/CalendarView.svelte";
  import Upcoming from "../components/Upcoming.svelte";
  import { loading } from "../lib/store";
</script>

<svelte:head>
  <title>Reservation af parkeringsplads</title>
  <meta name="robots" content="noindex nofollow" />
</svelte:head>

<div
  class="flex space-y-4 flex-col px-4 pb-6 justify-center w-full bg-[#F7F7F7] max-w-5xl mx-auto text-[#16182F]"
>
  <Upcoming loadingState={$loading} />
  <CalendarView loadingState={$loading} />
</div>
