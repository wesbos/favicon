import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import { serve } from "https://deno.land/std@0.180.0/http/server.ts";
const port = 8080;
const font = await Deno.readFile("NotoColorEmoji.ttf");

function makePng(emoji: string): Uint8Array {
  const canvas = createCanvas(128, 128);
  const ctx = canvas.getContext("2d");
  canvas.loadFont(font, { family: 'Noto Color Emoji' });
  ctx.font = "105px Noto Color Emoji";
  ctx.fillText(emoji, 0, 100);
  const png = canvas.toBuffer("image/png");
  return png;
}

export default function handler(request: Request): Response {
  const url = new URL(request.url);
  const emoji = decodeURIComponent(url.pathname.replace('/', ''));
  const png = makePng(emoji || '💩');
  return new Response(png, { status: 200, headers: { "Content-Type": "image/png" } });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
