<script>
  import Nav from "../../components/Nav.svelte";
  import SEO from "../../components/SEO/SEO.svelte";
  import BlogPosts from "../../components/BlogPosts.svelte";

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<SEO
  pageTitle="Jimmi's blog"
  metadescription="Here you can find useful articles"
/>
<Nav visible={true} />
<div class="sm:w-4/5 mx-auto">
  <BlogPosts posts={data.props.blogPosts} />
</div>
