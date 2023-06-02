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

  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#ffffff" />
</svelte:head>

<slot />

<!-- <Footer /> -->

<style>
</style>
