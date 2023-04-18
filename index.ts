import { createCanvas } from "canvas";
import { serve } from "server";
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

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const emoji = decodeURIComponent(url.pathname.replace('/', ''));
  console.log(emoji);
  const png = makePng(emoji);
  return new Response(png, { status: 200, headers: { "Content-Type": "image/png" } });
}

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
