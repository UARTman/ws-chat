import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch("http://194.87.248.194:8080/chat");
  const messages = await res.json();
  return {
    messages
  };
}
