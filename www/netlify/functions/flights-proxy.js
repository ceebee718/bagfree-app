exports.handler = async (event) => {
  const AVIATION_KEY = process.env.AVIATIONSTACK_KEY
  if (!AVIATION_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) }
  }

  try {
    const response = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${AVIATION_KEY}&flight_status=active&limit=8`
    )
    const data = await response.json()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) }
  }
}
