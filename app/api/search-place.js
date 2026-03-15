export default async function handler(req, res) {
  const { query } = req.query

  if (!query) {
    return res.status(400).json({ error: 'query parameter is required' })
  }

  const response = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=5`,
    {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      },
    }
  )

  if (!response.ok) {
    return res.status(response.status).json({ error: 'Naver API request failed' })
  }

  const data = await response.json()
  res.json(data)
}
