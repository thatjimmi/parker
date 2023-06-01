<!-- https://github.com/vkurko/calendar -->
<script>
    import Calendar from "../components/@event-calendar/core";
    import TimeGrid from "@event-calendar/time-grid";
    import Interaction from "@event-calendar/interaction";
    import List from "@event-calendar/list";
    import DayGrid from "@event-calendar/day-grid";
    import DatePicker from "../components/DatePicker/DatePicker.svelte";
    import DateInput from "../components/DatePicker/DateInput.svelte";

    export let data = {
        data: [],
    };

    let fromDate = null;
    let toDate = null;

    let events = data.data || [];

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
        events: events,
        allDaySlot: false,
        dateClick: (e) => {
            console.log("dateClick", e);
        },
        eventClick: (e) => {
            console.log("eventClick", e);
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
        // height: "40%",
        // slotMinTime: "08:00:00",
        // slotMaxTime: "20:00:00",
    };

    function clearFields() {
        title = "";
        starttidspunkt = "12:00";
        endetidspunkt = "12:00";
        fromDate = null;
        toDate = null;
    }

    function getHoursAndMinutes(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
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

        const formatter = new Intl.DateTimeFormat("da-DK", options);
        console.log(formatter.format(date));
        const formattedDate = formatter.format(date);

        const replace = formattedDate.replace(/\//g, "-");
        // first letter uppercase
        return replace.charAt(0).toUpperCase() + replace.slice(1);
    }

    function parseAndFormatDate(timeString) {
        const date = new Date(timeString);
        return formatDate(date);
    }

    function combineDateAndTime(dateObj, timeString) {
        const [hours, minutes] = timeString.split(":");
        const newDateObj = new Date(dateObj.getTime());
        newDateObj.setHours(Number(hours));
        newDateObj.setMinutes(Number(minutes));
        newDateObj.setSeconds(0);
        newDateObj.setMilliseconds(0);
        console.log("dateObj: ", newDateObj);
        return newDateObj;
    }

    let chosenEvent = {};
    let title = "";
    let starttidspunkt = "12:00";
    let endetidspunkt = "12:00";

    function addEvent() {
        const start = combineDateAndTime(fromDate, starttidspunkt);
        const end = combineDateAndTime(toDate, endetidspunkt);

        if (start > end) {
            alert("Starttidspunkt skal være før sluttidspunkt");
            return;
        }

        // check if event is already in calendar
        const eventExists = events.find((e) => {
            const eventStart = new Date(e.start);
            const eventEnd = new Date(e.end);
            return (
                eventStart.getTime() === start.getTime() &&
                eventEnd.getTime() === end.getTime()
            );
        });

        if (eventExists) {
            alert("Denne tid er allerede reserveret");
            return;
        }

        // check if time is already reserved
        const eventExistsInTime = events.find((e) => {
            const eventStart = new Date(e.start);
            const eventEnd = new Date(e.end);
            return (
                (start >= eventStart && start <= eventEnd) ||
                (end >= eventStart && end <= eventEnd)
            );
        });

        if (eventExistsInTime) {
            alert("Denne tid er allerede reserveret");
            return;
        }

        const event = {
            id: events.length + 1 + "",
            title: title,
            start: start,
            end: end,
        };

        events = [...events, event];
        options.events = events;

        clearFields();
    }
</script>

<div class="flex flex-col justify-center max-w-12xl mx-auto">
    <h3
        class="text-3xl md:text-4xl xl:text-5xl text-center font-semibold pt-4 px-8"
    >
        Reservation af parkeringsplads
    </h3>
    <div
        class="pb-8 pt-8 px-8 w-full md:w-4/5 lg:w-4/5 xl:w-3/5 2xl:w-1/2 mx-auto md:shadow border-gray-300 md:border m-4 rounded-xl"
    >
        <div class="lg:flex space-x-4 hidden">
            <div
                class="w-1/2 shadow border pt-6 pb-4 px-4 rounded-xl border-gray-300 bg-gray-50"
            >
                <DatePicker bind:value={fromDate} />
            </div>
            <div
                class="w-1/2 border shadow pt-6 pb-4 px-4 rounded-xl border-gray-300 bg-gray-50"
            >
                <DatePicker bind:value={toDate} />
            </div>
        </div>
        <div class="flex flex-col lg:hidden">
            <div class="mx-auto space-y-1 w-full">
                <p>Fra</p>
                <DateInput
                    bind:value={fromDate}
                    styling="text-lg text-center w-full text-gray-800 bg-gray-100"
                />
                <p>Til</p>
                <DateInput
                    bind:value={toDate}
                    styling="text-lg w-full text-gray-800 text-center bg-gray-100"
                />
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
                    <label for="title">Hvem reserverer</label>
                    <input
                        class="bg-gray-100 px-4 py-2 text-gray-800 rounded-lg border border-gray-300"
                        type="text"
                        id="title"
                        name="title"
                        bind:value={title}
                    />
                </div>
            </div>
            {#if fromDate && toDate && starttidspunkt && endetidspunkt && title}
                <div class="rounded-lg text-gray-900 lg:w-1/2 space-y-4">
                    <div class="space-y-2">
                        <p>Valgt fra</p>
                        <p
                            class="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300"
                        >
                            {parseAndFormatDate(
                                combineDateAndTime(fromDate, starttidspunkt)
                            )}
                        </p>
                    </div>
                    <div class="space-y-2">
                        <p>Til</p>
                        <p
                            class="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300"
                        >
                            {parseAndFormatDate(
                                combineDateAndTime(toDate, endetidspunkt)
                            )}
                        </p>
                    </div>
                </div>
            {:else}
                <div class="rounded-lg text-gray-900 text-center lg:w-1/2" />
            {/if}
        </div>
        {#if fromDate && toDate && starttidspunkt && endetidspunkt && title}
            <div class="text-center">
                <button
                    class="bg-sky-600 mt-6 text-white py-2 px-2 lg:w-1/3 rounded-lg w-full mx-auto shadow border border-gray-200"
                    type="submit"
                    on:click={addEvent}>Lav reservation</button
                >
            </div>
        {:else}
            <div class="text-center">
                <p
                    class="bg-gray-300 mt-6 text-gray-500 py-2 px-2 lg:w-1/3 w-full rounded-lg mx-auto shadow border border-gray-300"
                >
                    Lav reservation
                </p>
            </div>
        {/if}
    </div>
    <div
        class="pb-6 pt-4 md:border border-gray-300 px-8 md:shadow w-full md:w-4/5 lg:w-4/5 xl:w-3/5 2xl:w-1/2 mx-auto rounded-xl mb-4"
    >
        <div class="">
            <h2 class="text-3xl text-center">Reserverationer</h2>
            <button on:click={() => setOptionsPlugins()}>Skift view</button>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg shadow border-gray-300 border">
            {#key plugins}
                <Calendar {plugins} {options} />
            {/key}
        </div>
        {#if chosenEvent && chosenEvent.id}
            <div
                class="mt-4 bg-gray-50 shadow mx-auto px-4 py-4 rounded-lg border border-gray-300"
            >
                <h3 class="text-xl">{chosenEvent?.title}</h3>
                <div class="flex text-gray-600 space-x-2 text-sm">
                    <div class="space-y-0 w-1/2">
                        <p>Fra</p>
                        <p
                            class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg border border-gray-300"
                        >
                            {parseAndFormatDate(chosenEvent.start)}
                        </p>
                    </div>
                    <div class="space-y-0 w-1/2">
                        <p>Til</p>
                        <p
                            class="bg-gray-100 px-4 text-gray-800 py-2 rounded-lg border border-gray-300"
                        >
                            {parseAndFormatDate(chosenEvent.end)}
                        </p>
                    </div>
                </div>
            </div>
        {:else}
            <div class="mt-4">
                <h3 class="text-xl">Ingen reservation valgt</h3>
            </div>
        {/if}
    </div>
</div>
