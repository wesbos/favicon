export async function handler(req: any) {
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=UTF-8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    body: `Use it like <a href="/💩">/💩</a>`
  }
}

