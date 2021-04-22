// import { HttpRequest } from 'https://cdn.skypack.dev/@architect/functions';

// Caching for 1 min, but we should change this to 1 year once were happy
const cache = 'max-age=60';

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
      body: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>fav.farm</title>
          <link rel="icon" href="https://fav.farm/🚜" />
        </head>
        <body style="font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif; font-size: 20px;">
          <p>Use it like <a href="/💩">/💩</a></p>
          <code>
            &#x3C;link rel=&#x22;icon&#x22; href="https://fav.farm/💩" /&#x3E;
          </code>
        </body>
        </html>
      `
    }
  }

  // People could (did) inject script tags here. So we just take the first 11 chars. Which I think is the length of the longest emoji? 👩‍👩‍👧‍👧
  // We could also use dom purify, but....
  const cleanEmoji = emoji.slice(0,11);
  return {
    statusCode: 200,
    headers: {
      'content-type': 'image/svg+xml;',
      'cache-control': cache
    },
    body: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text x='0' y='14'>${cleanEmoji}</text></svg>`
  }
}

