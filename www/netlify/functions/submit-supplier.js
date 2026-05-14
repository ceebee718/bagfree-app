exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const AT_TOKEN = process.env.AIRTABLE_TOKEN;
  const AT_BASE  = process.env.AIRTABLE_BASE;
  const AT_URL   = `https://api.airtable.com/v0/${AT_BASE}/Suppliers`;

  try {
    const form = JSON.parse(event.body);
    const res = await fetch(AT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AT_TOKEN}`,
      },
      body: JSON.stringify({
        fields: {
          'Business Name':   form.biz,
          'Contact Person':  form.contact,
          'Email':           form.email,
          'Phone':           form.phone,
          'Website':         form.website || '',
          'Category':        form.category,
          'Destinations':    form.destinations.join(', '),
          'Description':     form.description,
          'Model':           form.model,
          'Commission Plan': form.commissionPlan === 'annual'
            ? 'Annual — 8% + $199/yr'
            : 'Monthly — 15%',
          'Status':          'Pending',
        },
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Airtable error');

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id: data.id }),
    };
  } catch (err) {
    console.error('submit-supplier error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
