import { browser } from '$app/environment';

export function log(event: string) {
    if (!event) {
        return;
    }

    const payload = {
        event,
        userId: browser ? localStorage.userId : null
    };

    const url = `https://us-central1-projects-376603.cloudfunctions.net/log?message=${JSON.stringify(
        payload
    )}`;

    fetch(url);
}