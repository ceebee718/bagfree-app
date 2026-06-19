exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const history = Array.isArray(body.history)
      ? body.history
      : Array.isArray(body.messages)
        ? body.messages
        : [];

    const lastUserMessage =
      [...history].reverse().find((m) => m && (m.role === 'user' || m.role === 'human'))?.content ||
      [...history].reverse().find((m) => m && (m.role === 'user' || m.role === 'human'))?.text ||
      '';

    const userMessage = String(
      body.userMessage ||
      body.message ||
      body.input ||
      lastUserMessage ||
      ''
    ).trim();

    const incomingSystemPrompt = String(body.systemPrompt || body.system || '').trim();

    const bagfreeSystemPrompt = `
You are BagFree Travel Brain, powered by Embr.

You are not to introduce yourself as Embr unless the user specifically asks about the underlying technology.
For normal users, your identity is BagFree Travel Brain.
When asked "who are you?", answer: "I’m BagFree Travel Brain, powered by Embr — your concierge for smarter travel, packing, delivery, and trip prep."

Stay focused on BagFree:
- travel planning
- packing help
- hotel or destination delivery
- order/delivery support
- kit/product recommendations
- concierge guidance
- reducing luggage stress
- connecting the user's trip intent to what BagFree can provide

BagFree positioning:
BagFree is not primarily a luggage storage finder. BagFree is a travel-light concierge that helps travelers prepare for a trip, decide what to carry, what to have delivered, what to order locally, and what to ship home afterward.
Only mention luggage storage if the user specifically asks about storing bags, early arrival, late checkout, or walking around before/after lodging access.

For normal travel-planning answers:
- Do not sound like a generic chatbot.
- Act like a premium BagFree concierge.
- Do not describe BagFree passively as “it can.” Speak directly as the Travel Brain.
- Every answer must connect the user's trip to concrete BagFree actions:
  1. pack lighter
  2. deliver ahead to hotel/rental
  3. prepare an essentials kit
  4. ship laundry, souvenirs, or excess items home
  5. reduce airport/hotel/luggage friction
- Do not make luggage storage the main recommendation unless the user asks about storage, early check-in, late checkout, or walking around with bags.
- Prefer hotel/rental delivery, destination prep, kits, local order support, and return shipping over generic storage advice.
- Never say “suggest the best local luggage storage spots” unless the user explicitly asks for luggage storage.
- Keep answers concise, polished, and practical.
- Avoid saying “if you want” repeatedly.
- End with one strong next step.
- For trip-prep questions, use this format exactly:
  Best move:
  What BagFree should handle:
  Next step:

Do not describe yourself as an operator layer, engine router, or generic chatbot in normal user-facing replies.
`.trim();

    const systemPrompt = [bagfreeSystemPrompt, incomingSystemPrompt].filter(Boolean).join("\n\n");

    if (!userMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing userMessage',
          detail: 'Expected userMessage, message, input, or a user message in messages/history.'
        })
      };
    }

    const identityQuestion = /\b(who are you|what are you|are you embr|is this embr|your name|what is this)\b/i.test(userMessage);

    if (identityQuestion) {
      const finalText = 'I’m BagFree Travel Brain, powered by Embr — your concierge for smarter travel, packing, delivery, and trip prep.';

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ok: true,
          text: finalText,
          reply: finalText,
          message: finalText,
          content: finalText,
          source: 'embr',
          identity: 'bagfree-travel-brain'
        })
      };
    }

    const baseUrl = process.env.EMBR_API_BASE_URL || 'https://api.embrintelligence.ai';
    const appId = process.env.EMBR_APP_ID || 'bagfree';
    const apiKey = process.env.EMBR_API_KEY || '';

    const embrRes = await fetch(`${baseUrl}/app-intelligence/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        'x-embr-app-id': appId,
        ...(apiKey ? { 'x-embr-app-key': apiKey } : {})
      },
      body: JSON.stringify({
        appId,
        message: userMessage,
        userMessage,
        messages: history,
        systemPrompt,
        environment: 'production',
        domain: 'travel',
        feature: 'bagfree_travel_brain',
        context: {
          app: 'BagFree',
          product: 'Travel Brain',
          travelerProfile: body.profile || {},
          activeTrip: body.activeTrip || {},
          instruction:
            'Act as BagFree Travel Brain: a refined travel concierge that connects trip intent to itinerary ideas, packing intelligence, hotel delivery, and BagFree kit recommendations.'
        }
      })
    });

    const data = await embrRes.json().catch(() => ({}));

    if (!embrRes.ok) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Travel Brain temporarily unavailable',
          detail: data?.error || data?.message || `Embr API error ${embrRes.status}`,
          embrStatus: embrRes.status,
          embr: data
        })
      };
    }

    const text = (
      data.text ||
      data.reply ||
      data.response ||
      data.message ||
      data.answer ||
      data.output ||
      data.content?.[0]?.text ||
      data.data?.text ||
      ''
    ).trim();

    const finalText = text || 'I had trouble generating your itinerary. Please try again.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        text: finalText,
        reply: finalText,
        message: finalText,
        content: finalText,
        source: 'embr'
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Travel Brain temporarily unavailable',
        detail: err.message
      })
    };
  }
};
