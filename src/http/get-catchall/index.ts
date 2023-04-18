// Cache for 1 week
const goodAssEmojis = ['💩', '🌶', '🔥', '🥰', '🖥', '👓'];

// Types were being slow on my internet, no caching in Arc for deno?
export async function handler (req: /* HttpRequest */ any) {
  let emoji = req.pathParameters.proxy;
  if (!emoji) {
    return {
      statusCode: 200,
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': `public, max-age=${60 * 60 * 24}, s-maxage=${60 * 60 * 24}`
      },
      body: /*html*/`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>fav.farm</title>
          <link rel="icon" href="https://fav.farm/🚜" />
        </head>
        <body>
          <h1>I bet you need a quick favicon</h1>
          <p>This startup returns an emoji inside an SVG<br>so you can pop that sucker into a favicon.</p>
          <p>Use it like <a href="/💩">/💩</a></p>
          ${goodAssEmojis.map(emoji => `
            <p><code onClick="copyToClipboard(this)" tabIndex="0">
              &#x3C;link rel=&#x22;icon&#x22; href="https://fav.farm/${emoji}" /&#x3E;
            </code></p>
          `).join('')}
          <br>
          <p>It works by serving up this SVG code: </p>
          <p class="small">
            <code onClick="copyToClipboard(this)" tabIndex="0">
&#x3C;link rel=&#x22;icon&#x22; href="data:image/svg+xml,&lt;svg xmlns=&#39;http://www.w3.org/2000/svg&#39; width=&#39;48&#39; height=&#39;48&#39; viewBox=&#39;0 0 16 16&#39;&gt;&lt;text x=&#39;0&#39; y=&#39;14&#39;&gt;😽&lt;/text&gt;&lt;/svg&gt;" /&#x3E;
            </code>
          </p>
          <p >You can use it with CSS Cursors too!</p>
          <code style="text-align:left;" onClick="copyToClipboard(this)" tabIndex="0">a { <br>
            &nbsp;&nbsp;cursor: url('https://fav.farm/🖕') 15 0, auto;<br>
          }</code>
          <br>
          <p><small>Made with 🖤 by <a href="https://twitter.com/wesbos">@wesbos</a></small></p>
          <style>
            body {
              font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif; font-size: 20px; text-align: center;
              cursor: url('/🖕') 15 0, auto;
              min-height: 100vh;
            }
            code {
              background: white;
              transition: all 0.2s;
              --scale: 1;
              --rotate: 0;
              transform: scale(var(--scale)) rotate(var(--rotate));
              display: inline-block;
            }
            code.hl {
              background: #f9f9ae;
              --rotate: -1deg;
              --scale: 1.1;
            }
            p {
              max-width: 600px;
              margin: 0 auto;
              line-height: 2;
              margin-bottom: 20px;
            }
            p.small {
              font-size: 13px;
            }
          </style>
          <script>
            function copyToClipboard(codeEl) {
              navigator.clipboard.writeText(codeEl.innerText);
              codeEl.classList.add('hl');
              setTimeout(() => codeEl.classList.remove('hl'), 200);
            }
          </script>
        </body>
        </html>
      `
    }
  }

  // People could (did) inject script tags here. So let's escape & and <
  const cleanEmoji = emoji.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return {
    statusCode: 200,
    headers: {
      'content-type': 'image/svg+xml;',
      'cache-control': `public, max-age=${60 * 60 * 24}, s-maxage=${60 * 60 * 24 * 7}`
    },
    body: `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 16 16'><text x='0' y='14'>${cleanEmoji}</text></svg>`
  }
}
