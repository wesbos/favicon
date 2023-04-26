import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
import { makeHomePage } from "./homePage.ts";
const port = 8080;
const font = await Deno.readFile("./NotoColorEmoji.ttf");

export function makePng(emoji: string): Uint8Array {
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext("2d");
  canvas.loadFont(font, { family: "Noto Color Emoji" });
  ctx.font = "105px Noto Color Emoji";
  ctx.fillText(emoji, 0, 100);
  const png = canvas.toBuffer("image/png");
  return png;
}

export function handlerSafari(request: Request): Response {
  const url = new URL(request.url);
  const emoji = decodeURIComponent(url.pathname.replace("/", ""));
  const png = makePng(emoji || "💩");
  return new Response(png, {
    status: 200,
    headers: { "Content-Type": "image/png" },
  });
}

export function handler(request: Request): Response {
  const url = new URL(request.url);
  const emoji = decodeURIComponent(url.pathname.replace("/", ""));

  if (!emoji) {
    return new Response(makeHomePage(), {
      status: 200,
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": `public, max-age=${60 * 60 * 24}, s-maxage=${
          60 * 60 * 24
        }`,
      },
    });
  }

  // Safari doesn't support SVG fonts, so we need to make a PNG
  const forceSvg = url.search.includes('svg'); // ?svg tacked on the end forces SVG, handy for css cursors
  if (!forceSvg && request.headers.get("user-agent")?.includes("Safari") && !request.headers.get("user-agent")?.includes("Chrome")) {
    return handlerSafari(request);
  }

  // People could (did) inject script tags here. So let's escape & and <
  const cleanEmoji = emoji.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return new Response(`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 16 16'><text x='0' y='14'>${cleanEmoji}</text></svg>`, {
    status: 200,
    headers: {
      "content-type": `image/svg+xml;`,
      "cache-control": `public, max-age=${60 * 60 * 24}, s-maxage=${
        60 * 60 * 24 * 7
      }`,
    }
  });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
