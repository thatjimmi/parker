<script>
  export let extraClass = "";
</script>

<nav
  class=" {extraClass} z-50 py-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 relative sm:justify-between sm:items-center sm:mx-auto md:px-20 h-12"
>
  <div class="space-x-4 flex items-center">
    <div class="mx-auto md:mx-0 flex items-center space-x-3">
      <div class="space-x-8">
        <a
          id="logo"
          class=" text-2xl tracking-tight leading-tight inline-flex font-medium"
          href="/"
          >Ysers.co
        </a>
      </div>
    </div>
  </div>

  <!-- end logo -->

  <div class="flex text-center font-light flex-col w-full xl:px-8">
    <!-- <ul>
      <li>dude</li>
    </ul> -->
  </div>

  <!-- login -->
  <div class="flex-initial invisible lg:visible">
    <div class="flex justify-end items-center relative">
      <div class="flex items-center space-x-2">
        <a class="text-gray-100 text-tiny" href="/blog">Blog</a>
      </div>
    </div>
  </div>
</nav>
