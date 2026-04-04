import {
  getEmojiCounts,
  getTopRequestSources,
  type CloudflareEnv,
  type PerfLogContext,
} from "./db";

const goodAssEmojis = ["💩", "🌶", "🔥", "🥰", "🖥", "👓"];
const formatter = new Intl.NumberFormat("en-US");

export async function makeHomePage(env: CloudflareEnv, perf: PerfLogContext = {}) {
  const { topEmojis, countryEmojis, totalCount } = await getEmojiCounts(env, perf);
  const { topCountries, topReferrers, topGeoBuckets } = await getTopRequestSources(env, perf);
  return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Emoji as Favicon - fav.farm</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="icon" href="/🚜" />
        </head>
        <body>
          <h1>I bet you need a quick favicon!!</h1>
          <p>This startup returns an emoji inside an SVG<br>so you can pop that sucker into a favicon.</p>
          <p>Use it like <a href="/💩">/💩</a> or <a href="/poop">/poop</a></p>
          ${goodAssEmojis
            .map(
              (emoji) => `
            <p><code onClick="copyToClipboard(this)" tabIndex="0">
              &#x3C;link rel=&#x22;icon&#x22; href="https://fav.farm/${emoji}" /&#x3E;
            </code></p>
          `,
            )
            .join("")}
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
          <p><strong>${formatter.format(totalCount)}</strong> Emoji Favicons Served!
          <br>
          <small>(since I started counting Oct 3, 2024)</small>
        </p>
          <div class="stats">
          ${topEmojis
            .map(
              ([emoji, count]) => `<div class="stat">
              <a href="/${emoji}">
                <span class="emoji">${emoji}</span>
                <span class="count">${formatter.format(count)}</span>
              </a>
            </div>`,
            )
            .join("")}
          </div>
          <br>
          <p>Top Country Emojis used <br><small>(you guys are so silly gaming these numbers)</small></p>
          <div class="stats">
          ${countryEmojis
            .map(
              ([emoji, count]) => `<div class="stat">
              <a href="/${emoji}">
                <span class="emoji">${emoji}</span>
                <span class="count">${formatter.format(count)}</span>
              </a>
            </div>`,
            )
            .join("")}
          </div>
          <br>
          <p>Where favicon requests are coming from</p>
          <div class="source-columns">
            <div class="source-column">
              <h3>Top Countries</h3>
              ${topCountries
                .map(
                  ([country, count]) => `<div class="source-row">
                    <span>${country}</span>
                    <strong>${formatter.format(count)}</strong>
                  </div>`,
                )
                .join("")}
            </div>
            <div class="source-column">
              <h3>Top Referrers</h3>
              ${topReferrers
                .map(
                  ([referrer, count]) => `<div class="source-row">
                    <span>${referrer}</span>
                    <strong>${formatter.format(count)}</strong>
                  </div>`,
                )
                .join("")}
            </div>
            <div class="source-column">
              <h3>Top Geo Buckets</h3>
              ${topGeoBuckets
                .map(
                  ([bucket, count]) => `<div class="source-row">
                    <span>${bucket}</span>
                    <strong>${formatter.format(count)}</strong>
                  </div>`,
                )
                .join("")}
            </div>
          </div>


          <p><small>Made with 🖤 by <a href="https://x.com/wesbos">@wesbos</a>
            ×
            <a href="https://github.com/wesbos/favicon">
              source 👩‍💻
            </a>
            ×
            Its TS + Cloudflare Workers
            </small>
          </p>
          <style>
            body {
              font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif; font-size: 20px; text-align: center;
              cursor: url('/🖕?svg') 15 0, auto;
              min-height: 100vh;
            }
            code {
              background: white;
              transition: all 0.2s;
              --scale: 1;
              --rotate: 0;
              transform: scale(var(--scale)) rotate(var(--rotate));
              display: inline-block;
              overflow-wrap: break-word;
              max-width: 100%;
              box-sizing: border-box;
            }
            code.hl {
              background: #f9f9ae;
              --rotate: -1deg;
              --scale: 1.1;
            }
            a {
              cursor: url('/👌?svg') 25 25, auto;
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
            .stats {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
              justify-content: center;
              flex-wrap: wrap;
              gap: 5px;
              max-width: 1200px;
              margin: 20px auto;
            }
            .stat {
              background: #f1f1f1;
              padding: 4px 4px;
              line-height: 1;
              border-radius: 10px;
              a {
                text-decoration: none;
              }
              .emoji {
                font-size: 35px;
                display: block;
              }
              .count {
                font-size: 12px;
                color: #666;
              }
            }
            .source-columns {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
              gap: 20px;
              max-width: 900px;
              margin: 20px auto;
              text-align: left;
            }
            .source-column h3 {
              margin-bottom: 8px;
            }
            .source-row {
              display: flex;
              justify-content: space-between;
              gap: 8px;
              padding: 6px 8px;
              margin-bottom: 4px;
              background: #f7f7f7;
              border-radius: 8px;
              font-size: 14px;
            }
            .source-row span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
      `;
}
