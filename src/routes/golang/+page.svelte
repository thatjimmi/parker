<script>
  import "../../style.css";
  import SvelteSeo from "svelte-seo";
  import Nav from "../../components/Nav.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  let department = "";
  let username = "";

  // post data to the server
  const postData = async () => {
    // return if the fields are empty
    if (!department || !username) return;

    const res = await fetch("http://localhost:3000/records", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        department: department,
        username: username,
      }),
    });
    await res.json();

    // reload the page
    location.reload();
  };

  // delete data from the server
  const deleteData = async (id) => {
    const res = await fetch(`http://localhost:3000/records/${id}`, {
      method: "DELETE",
    });
    await res.json();

    // reload the page
    location.reload();
  };
</script>

<!-- <div class="bg-gray-300 h-screen">
  <Nav extraClass="bg-white" />
  <SvelteSeo />
  form to send username and department
  <div class="flex flex-col">
    <div class="flex space-x-2 justify-center py-4 items-center">
      <form class="flex flex-col space-y-2">
        <input
          type="text"
          class="px-3 rounded-lg py-2 outline-none"
          placeholder="department"
          bind:value={department}
        />
        <input
          type="text"
          class="px-3 rounded-lg py-2 outline-none"
          placeholder="username"
          bind:value={username}
        />
      </form>
      <button
        class="bg-blue-600 p-1 px-4 rounded-md text-white h-12"
        on:click={postData}>Add user</button
      >
    </div>
    <div class="grid grid-cols-3 mx-auto gap-4 justify-center py-4">
      {#each data.props?.records as record}
        <div
          class="flex flex-col justify-center bg-gray-100 p-4 px-4 rounded-lg w-80"
        >
          <h3 class="text-2xl">Title</h3>
          <p>Department: {record.department}</p>
          <p>Username: {record.username}</p>
          <button
            class="bg-red-600 mt-2 p-1 px-2 rounded-md text-white"
            on:click={() => deleteData(record.uid)}>Delete</button
          >
        </div>
      {/each}
    </div>
  </div>
</div> -->
