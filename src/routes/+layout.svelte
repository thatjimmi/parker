<script>
  import "../style.css";

  // try {
  //   if (typeof window !== "undefined" && window) {
  //     const googleAnalyticsId = "G-7SYZV40WPN";
  //     window.dataLayer = window.dataLayer || [];
  //     function gtag() {
  //       window.dataLayer.push(arguments);
  //     }
  //     gtag("js", new Date());
  //     gtag("config", googleAnalyticsId);
  //   }
  // } catch (error) {
  //   console.error("Failed to initialize Analytics");
  // }
</script>

<svelte:head>
  <!-- <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-7SYZV40WPN"
  ></script> -->

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<slot />

<!-- <Footer /> -->

<style>
</style>
