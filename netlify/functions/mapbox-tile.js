exports.handler = async (event) => {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) {
    return { statusCode: 500, body: 'Mapbox token not configured' };
  }

  const { lon, lat, zoom } = event.queryStringParameters || {};
  if (!lon || !lat || !zoom) {
    return { statusCode: 400, body: 'Missing lon, lat or zoom' };
  }

  const url = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${lon},${lat},${zoom},0/1000x600@2x?access_token=${token}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { statusCode: response.status, body: 'Mapbox error' };
    }
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // cache 24hrs
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (err) {
    return { statusCode: 500, body: 'Fetch error: ' + err.message };
  }
};
