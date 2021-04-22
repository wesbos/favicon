// import { HttpRequest } from 'https://cdn.skypack.dev/@architect/functions';

// Caching for 10 mins, but we should change this to 1 year once were happy
const cache = 'max-age=600';

// Types were being slow on my internet, no caching in Arc for deno?
export async function handler (req: /* HttpRequest */ any) {
  let emoji = req.pathParameters.proxy;
  if (!emoji) {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': cache
      },
      body: `Use it like <a href="/💩">/💩</a>`
    }
  }

  return {
    statusCode: 200,
    headers: {
      'content-type': 'image/svg+xml;',
      'cache-control': cache
    },
    body: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text x='0' y='14'>${emoji}</text></svg>`
  }
}

