export const db = await Deno.openKv();

export function incrementCount(emoji: string) {
  const VIEW_KEY = [`favicon`, `${emoji}`];
  // also Update + query via Deno KV
  return db.atomic().sum(VIEW_KEY, 1n).commit(); // Increment KV by 1
}

export async function getEmojiCounts() : Promise<{
  topEmojis: [string, number][];
  countryEmojis: [string, number][];
  totalCount: number;
}> {
  const counts = db.list<bigint>({ prefix: ["favicon"] });
  const emojis: [string, number][] = [];
  for await (const count of counts) {
    emojis.push([count.key[1] as string, Number(count.value)]);
  }
  emojis.sort((a, b) => b[1] - a[1]);

  const totalCount = emojis.reduce((acc, [_, count]) => acc + count, 0);
  // Filter out country flags
  const [topEmojis, countryEmojis] = emojis.reduce((acc, [emoji, count]) => {
    if (emoji.match(/[🇦-🇿]{2}/u)) {
      acc[1].push([emoji, count]);
    } else {
      acc[0].push([emoji, count]);
    }
    return acc;
  }, [[], []] as [[string, number][], [string, number][]]);
  return { topEmojis, countryEmojis, totalCount };
}
