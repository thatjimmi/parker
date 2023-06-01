import { error } from '@sveltejs/kit';
import { marked } from "marked";

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, params }) => {
  const blogPosts = await fetch('/posts.json').then(r => r.json());
  const slug = params.slug
  const res = await fetch(`/Markdown/${slug}.md`)
  let markdown = await res.text();
  if (!res.ok) {
    markdown = 'Der er ikke nogen markdown fil til denne post'
  }
  const post = blogPosts[slug]  
  if (post) {
    return {
        title: post.title,
        undertitel: post.undertitel,
        forfatter: post.forfatter,
        forfatterTitel: post.forfatterTitel,
        html: marked(markdown),
        forfatterBillede: post.forfatterBillede,
        img: post.img,
        dato: post.date,
        // relatedPosts: getRandomArticles(blogPosts, 4, slug),
    };
  }
 
  throw error(404, {
    message: 'Not found'
});
}

function getRandomArticles(obj, numObjects, excludeKey) {
  let keys = Object.keys(obj);
  let randomKeys = [];

  for (let i = 0; i <= numObjects; i++) {
    // generate a random index within the current array size
    let randomIndex = Math.floor(Math.random() * keys.length);

    // add the key at the random index to the result array
    randomKeys.push(keys[randomIndex]);

    // remove the key from the keys array
    keys.splice(randomIndex, 1);
  }

  let result = {};
  randomKeys.forEach((key) => {
    if (key !== excludeKey ) {
      result[key] = obj[key];
    }
  });

  return result;
}