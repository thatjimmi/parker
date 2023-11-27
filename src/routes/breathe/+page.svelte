<script lang="ts">
  import { onMount } from "svelte";

  let text = "Breathe";
  let dot;
  let container;
  let position = 0;
  let edgeLength; // will be set dynamically
  let speed; // will be set dynamically

  let timeLeft = 298; // 5 minutes in seconds
  let display = "4:58";

  onMount(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        timeLeft -= 1;
      } else {
        display = "0:00";

        clearInterval(timer);
      }
    }, 1000);

    const resizeHandler = () => {
      edgeLength = container.offsetWidth - 20; // Set edgeLength based on container width
      speed = 4000 / edgeLength; // Adjust speed accordingly
    };

    window.addEventListener("resize", resizeHandler);
    resizeHandler(); // Call once on mount to set initial values

    const updatePosition = () => {
      const edgePosition = position % edgeLength;
      let top, left;
      if (position < edgeLength) {
        // top edge
        top = 0;
        left = edgePosition;
      } else if (position < edgeLength * 2) {
        // right edge
        top = edgePosition;
        left = edgeLength;
      } else if (position < edgeLength * 3) {
        // bottom edge
        top = edgeLength;
        left = edgeLength - edgePosition;
      } else {
        // left edge
        top = edgeLength - edgePosition;
        left = 0;
      }

      return `top: ${top}px; left: ${left}px;`;
    };

    const interval = setInterval(() => {
      position = (position + 1) % (edgeLength * 4);
      dot.style = updatePosition();
      text = ["Breathe", "Hold", "Exhale", "Hold"][
        Math.floor(position / edgeLength)
      ];
    }, speed);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeHandler);
    };
  });
</script>

<div
  class="flex items-center flex-col justify-center w-full"
  style="height: 100svh;"
>
  <div
    bind:this={container}
    class="relative bg-slate-50 border-black border-2 rounded-lg w-[200px] sm:max-w-[400px] h-[200px] sm:max-h-[400px]"
  >
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <h1
        class="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center"
      >
        {text}
      </h1>
    </div>
    <div
      bind:this={dot}
      class="absolute w-4 h-4 rounded-full border bg-black"
    ></div>
  </div>
  <div>
    <h1
      class="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center"
    >
      {display}
    </h1>
  </div>
</div>
