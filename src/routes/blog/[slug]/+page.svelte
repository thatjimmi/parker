<script>
  /** @type {import('./$types').PageData} */
  export let data;
  import Nav from "../../../components/Nav.svelte";
  import ArticlesCards from "../../../components/ArticlesCards.svelte";
  import "../../../style.css";
  import SEO from "../../../components/SEO/SEO.svelte";
</script>

<SEO pageTitle={data.title} metadescription={data.undertitel} />
<Nav
  color="white"
  visible={true}
  ctaTextColor="white"
  extraClass="bg-black"
  textColor="white"
/>
<div class="w-full bg-black pb-8 md:pt-24 pt-12">
  <div class="md:w-4/5 lg:w-3/5 flex flex-col mx-auto px-8 text-white">
    <h1
      class="text-3xl sm:text-4xl md:text-5xl leading-tight font-semibold md:-mb-2 tracking-tight"
    >
      {data.title}
    </h1>
    <p class="text-white text-md md:text-xl font-light">
      {data.undertitel}
    </p>
    <address class="flex items-center mt-2 not-italic">
      <div class="inline-flex items-center mr-3 text-sm text-gray-100">
        <img
          class="mr-4 w-16 h-16 rounded-full object-cover object-top"
          src={data.forfatterBillede}
          alt="Jese Leos"
        />
        <div>
          <a
            href="/"
            rel="author"
            class="text-xl font-semibold text-gray-100 dark:text-white"
            >{data.forfatter}</a
          >
          <p class="text-base font-light text-gray-200 dark:text-gray-100">
            {data.forfatterTitel}
          </p>
          <p class="text-base font-light text-gray-200 dark:text-gray-100">
            <time>{data.dato}</time>
          </p>
        </div>
      </div>
    </address>
  </div>
</div>

<main class=" md:w-4/5 lg:w-3/5 mx-auto mb-8 px-8 py-6 md:rounded">
  <div class="prose font-light prose-h1:text-4xl max-w-full mx-auto">
    {@html data.html}
  </div>
</main>

<!-- <ArticlesCards articles={data.relatedPosts} /> -->

<style>
</style>
