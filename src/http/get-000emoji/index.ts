// import { HttpRequest } from 'https://cdn.skypack.dev/@architect/functions';

// Types were being slow on my internet, no caching in Arc for deno?
export async function handler (req: /* HttpRequest */ any) {
  let emoji = req.pathParameters.emoji;
  if (!emoji) {
    emoji = '💩';
  }

  return {
    statusCode: 200,
    headers: {
      'content-type': 'image/svg+xml;',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    body: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text x='0' y='14'>${req.pathParameters.emoji}</text></svg>`
  }
}

