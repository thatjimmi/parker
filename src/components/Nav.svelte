<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { fetchEvents, loading } from "../lib/store";

  $: spinning = $loading;

  let active;
  $: active =
    $page.url.pathname === "/reservation" ? "reservation" : "overview";

  function toggleSwitch() {
    goto(active === "overview" ? "/reservation" : "/");
  }
</script>

<div class="flex pt-4 justify-center items-center">
  <div class="border rounded-3xl overflow-hidden">
    <button
      class="{active === 'overview' ? 'bg-white  ' : ''}  px-3 pl-4 py-1"
      on:click={toggleSwitch}
    >
      <span class="text-sm">Kalender</span>
    </button>

    <button
      class="{active === 'reservation' ? 'bg-white ' : ''}  px-3 pr-4 py-1"
      on:click={toggleSwitch}
    >
      <span class="text-sm">Reserver</span>
    </button>
  </div>
  <button class="ml-2" on:click={() => fetchEvents("/api/airtable")}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5"
      class:spinning
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  </button>
</div>

<style>
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .spinning {
    animation: spin 1.5s linear;
  }
</style>
