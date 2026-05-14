exports.handler = async () => {
  const AT_TOKEN = process.env.AIRTABLE_TOKEN;
  const AT_BASE  = process.env.AIRTABLE_BASE;
  const filter   = encodeURIComponent("{Status}='Approved'");
  const AT_URL   = `https://api.airtable.com/v0/${AT_BASE}/Suppliers?filterByFormula=${filter}`;

  try {
    const res = await fetch(AT_URL, {
      headers: { Authorization: `Bearer ${AT_TOKEN}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Airtable error');

    const vendors = (data.records || []).map(r => ({
      id:        r.id,
      name:      r.fields['Business Name'] || 'New Supplier',
      tag:       'Verified Supplier',
      icon:      '◈',
      category:  r.fields['Category'] || '',
      dest:      r.fields['Destinations'] || '',
      desc:      r.fields['Description'] || '',
      highlight: false,
      url:       r.fields['Website'] || null,
      color:     'mist',
      products:  [],
      badge:     'Shop Now',
    }));

    return {
      statusCode: 200,
      headers: { 'Cache-Control': 'public, max-age=60' },
      body: JSON.stringify(vendors),
    };
  } catch (err) {
    console.error('get-vendors error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify([]),
    };
  }
};
