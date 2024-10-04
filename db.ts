export const db = await Deno.openKv();

export async function incrementCount(emoji: string) {
  const VIEW_KEY = [`favicon`, `${emoji}`];
  // also Update + query via Deno KV
  return db.atomic().sum(VIEW_KEY, 1n).commit(); // Increment KV by 1
}

export async function getEmojiCounts() {
  const counts = db.list<bigint>({ prefix: ["favicon"] });
  const emojis = [];
  for await (const count of counts) {
    emojis.push([count.key[1], Number(count.value)]);
  }
  emojis.sort((a, b) => b[1] - a[1]);
  return emojis;
}
