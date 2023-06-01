import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export const load = async ({ fetch, params}) => {
    const blogPosts = await fetch('/posts.json').then(r => r.json());

    return { props: { blogPosts } };


}