<script lang="ts">
    import DatePicker from "../components/date-picker-svelte/DatePicker.svelte";
    import { reservering } from "../Stores/reservering"; // store for selected service
    let date = new Date();

    let times = [
        "12.00",
        "12.30",
        "13.00",
        "13.30",
        "14.00",
        "14.30",
        "15.00",
        "15.30",
        "16.00",
        "16.30",
        "17.00",
        "17.30",
        "18.00",
        "18.30",
        "19.00",
        "19.30",
        "20.00",
        "20.30",
        "21.00",
        "21.30",
        "22.00",
        "22.30",
        "23.00",
        "23.30",
    ];
    let search = false;
    let selectedTime;
    let tidspunkt;
</script>

<div class="rounded-lg mt-2 max-w-sm mx-auto">
    <div class="bg-wuffie-green py-2 rounded-t-lg">
        <h3 class="text-2xl text-white font-medium text-center">Bestil tid</h3>
    </div>
    <div class="px-4 border rounded-b-lg pb-6">
        <div class="mt-4 mb-2 flex px-1 justify-center">
            <DatePicker bind:value={date} />
        </div>
        <div class="w-11/12 mx-auto">
            <label for="tidspunkt" class="text-sm font-semibold text-gray-600">
                Vælg tidspunkt
                <select
                    bind:value={tidspunkt}
                    name=""
                    id=""
                    class="w-full py-2 appearance-none px-2 border rounded mt-1"
                >
                    {#each times as time}
                        <option value={time}>{time}</option>
                    {/each}
                </select>
            </label>
        </div>
        {#if search}
            <div class="px-2">
                {#if available.length === 0}
                    <p class="text-sm text-gray-600">Ingen ledige tider</p>
                {:else}
                    <p class="pb-2 mt-2 text-sm font-semibold text-gray-600">
                        Vælg tid
                    </p>
                {/if}
                <ul class="grid grid-cols-3 gap-2">
                    {#each available as time}
                        <li>
                            <button
                                type="button"
                                on:click={() =>
                                    (selectedTime =
                                        new Date(date).toLocaleDateString() +
                                        " " +
                                        time.time)}
                                class="text-white w-full bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
                                >{time.time}</button
                            >
                        </li>
                    {/each}
                    <ul />
                </ul>
            </div>
        {/if}
        {#if selectedTime}
            <p
                class="pb-2 mt-4 text-sm text-center font-semibold text-gray-600"
            >
                Du har valgt
            </p>
            <div
                class=" max-w-sm mx-auto border {$chosenService.navn !==
                'Vælg behandling'
                    ? 'bg-green-100'
                    : 'bg-red-100'} rounded-lg text-left"
            >
                <img
                    class="w-full rounded-t-lg h-1/2"
                    src={$chosenService.navn === "Vælg behandling"
                        ? "https://images.unsplash.com/photo-1603724819619-a0858e51e762?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHNhZCUyMGRvZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                        : $chosenService.billede}
                    alt=""
                />
                <div class="px-6">
                    <p class="font-semibold text-gray-800 mt-2">
                        {#if $chosenService.navn === "Vælg behandling"}
                            Ingen behandling valgt
                        {:else}
                            {$chosenService.navn}
                        {/if}
                    </p>
                    <p class="text-gray-700 text-sm">
                        {selectedTime}
                    </p>
                    <button
                        on:click={() => bookAppointment()}
                        type="button"
                        class="text-white mt-2 w-full mb-4 bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5"
                        >Anmod om en aftale</button
                    >
                </div>
            </div>
        {/if}
    </div>
</div>
