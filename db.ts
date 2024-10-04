export const db = await Deno.openKv();

export async function incrementCount(emoji: string) {
  await db.delete(["favicon"]);
  const VIEW_KEY = [`favicon`, `${emoji}`];
  // also Update + query via Deno KV
  await db.atomic().sum(VIEW_KEY, 1n).commit(); // Increment KV by 1
  const res = await db.get<Deno.KvU64>(VIEW_KEY);
  const denoKVCount = res.value?.value || 0n;
  return {
    denoKVCount,
  };
}

export async function getEmojiCounts() {
  const counts = db.list<number>({ prefix: ["favicon"] });
  const emojis = [];
  for await (const count of counts) {
    emojis.push([count.key[1], Number(count.value)]);
  }
  emojis.sort((a, b) => b[1] - a[1]);
  return emojis;
}
