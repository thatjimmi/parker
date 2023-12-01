import { writable } from "svelte/store";

export const loading = writable(true);
export const events = writable([]);

export const fetchEvents = async (url) => {
    loading.set(true);
    try {
        const response = await fetch(url)
    if (response.ok) {
      const newData = await response.json();
      events.set(newData);
    } } catch (error) {
        console.error(error);
    } finally {
        setTimeout(() => {
            loading.set(false);
        }, 800);
    }
}